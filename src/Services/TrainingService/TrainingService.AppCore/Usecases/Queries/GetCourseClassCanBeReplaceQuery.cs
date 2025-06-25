using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetCourseClassCanBeReplaceQuery(
    string SemesterCode,
    int Stage,
    string SubjectCode,
    string CurrentCourseClassCode,
    List<string> CourseClassCodes) : IQuery<ListResultModel<CourseClass>>
{
    
    internal class Handler(
        IMongoRepository<SlotTimeline> slotTimelineRepository,
        IMongoRepository<CourseClass> courseClassRepository)
        : IRequestHandler<GetCourseClassCanBeReplaceQuery, ResultModel<ListResultModel<CourseClass>>>
    {
        public async Task<ResultModel<ListResultModel<CourseClass>>> Handle(GetCourseClassCanBeReplaceQuery request, CancellationToken cancellationToken)
        {
            // 1. Lịch hiện tại của sinh viên
            var slotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByCourseClassCodesSpec(request.CourseClassCodes ?? []),
                cancellationToken);

            // 2. Các lớp cùng môn, cùng stage (trừ lớp hiện tại)
            var courseClassesOfSubject = await courseClassRepository.FindAsync(
                new GetCourseClassBySemesterCodeAndListStageAnsSubjectCodeSpec(request.SemesterCode, request.SubjectCode, [request.Stage]),
                cancellationToken);
            var candidateCourseClasses = courseClassesOfSubject
                .Where(e => e.CourseClassCode != request.CurrentCourseClassCode)
                .ToList();

            // 3. Lịch của các lớp ứng viên
            var slotTimelineOfCandidateClasses = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByCourseClassCodesSpec(candidateCourseClasses.Select(e => e.CourseClassCode).ToList()),
                cancellationToken);

            // 4. Lọc các lớp không trùng lịch
            bool IsConflict(SlotTimeline a, SlotTimeline b)
            {
                if (a.DayOfWeek != b.DayOfWeek) return false;
                if (a.EndWeek < b.StartWeek || a.StartWeek > b.EndWeek) return false;
                return a.Slots.Intersect(b.Slots).Any();
            }

            var slotTimelineDict = slotTimelineOfCandidateClasses
                .GroupBy(x => x.CourseClassCode)
                .ToDictionary(g => g.Key, g => g.ToList());

            var slotTimelinesOfStudent = slotTimelines.ToList();
            var replaceableCourseClasses = new List<CourseClass>();

            foreach (var courseClass in candidateCourseClasses)
            {
                if (!slotTimelineDict.TryGetValue(courseClass.CourseClassCode, out var slotsOfClass))
                    continue;
                bool conflict = slotsOfClass.Any(slotOfClass =>
                    slotTimelinesOfStudent.Any(studentSlot => IsConflict(slotOfClass, studentSlot))
                );
                if (!conflict)
                {
                    replaceableCourseClasses.Add(courseClass);
                }
            }

            return ResultModel<ListResultModel<CourseClass>>.Create(
                ListResultModel<CourseClass>.Create(replaceableCourseClasses, replaceableCourseClasses.Count, 1, 10));
        }
    }
    
}