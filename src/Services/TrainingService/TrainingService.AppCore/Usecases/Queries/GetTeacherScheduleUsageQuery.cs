using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;



public record GetTeacherScheduleUsageQuery(GetTeacherScheduleUsageQuery.GetTeacherScheduleUsageModel Model)
    : IListQuery<ListResultModel<GetTeacherScheduleUsageQuery.TeacherScheduleUsageModel>>
{
    public record struct TeacherScheduleUsageModel(Staff Staff, double Usage);
    public record struct GetTeacherScheduleUsageModel(string SemesterCode, int Stage, List<string> StaffCodes);
    
    internal class Handler(
        IMongoRepository<Staff> staffRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository)
        : IRequestHandler<GetTeacherScheduleUsageQuery,
        ResultModel<ListResultModel<TeacherScheduleUsageModel>>>
    {
        public async Task<ResultModel<ListResultModel<TeacherScheduleUsageModel>>> Handle(
            GetTeacherScheduleUsageQuery request, CancellationToken cancellationToken)
        {
            var staffs = await staffRepository.FindAsync(
                new GetStaffsSpec(request),
                cancellationToken: cancellationToken);
            var count = await staffRepository.CountAsync(new GetStaffsSpec(request), cancellationToken);
            var courseClassesOfTeacher = await courseClassRepository.FindAsync(
                new GetCourseClassBySemesterCodeAndStageAndListStaffCodeSpec(
                    request.Model.SemesterCode, request.Model.Stage, request.Model.StaffCodes),
                cancellationToken: cancellationToken);
            var spec = new GetSlotTimelineByListCourseClassCodeSpec(courseClassesOfTeacher
                .Select(c => c.CourseClassCode).ToList());
            var result = new List<TeacherScheduleUsageModel>();
            foreach (var staff in staffs)
            {
                var courseClasses = courseClassesOfTeacher
                    .Where(c => c.TeacherCode == staff.Code).ToList();
                if (!courseClasses.Any())
                    continue;
                var totalUsage = courseClassesOfTeacher.Where(e => e.TeacherCode == staff.Code)
                    .Sum(e => e.TotalSession);
                var usage = totalUsage / 290;
                result.Add(new TeacherScheduleUsageModel(staff, usage));
            }

            return ResultModel<ListResultModel<TeacherScheduleUsageModel>>.Create(
                ListResultModel<TeacherScheduleUsageModel>.Create(result, count, request.Page, request.PageSize));

        }
    }

    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}