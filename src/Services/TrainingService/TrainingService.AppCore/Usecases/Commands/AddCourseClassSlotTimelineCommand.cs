using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record AddCourseClassSlotTimelineCommand(AddCourseClassSlotTimelineCommand.UpdateCourseClassSlotTimelineModel Model) : ICommand<IResult>
{
    public record struct UpdateCourseClassSlotTimelineModel(string CourseClassCode, string RoomCode, int DayOfWeek, List<string> Slots);
    internal class Handler(
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository,
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository)
        : IRequestHandler<AddCourseClassSlotTimelineCommand, IResult>
    {
        public async Task<IResult> Handle(AddCourseClassSlotTimelineCommand request, CancellationToken cancellationToken)
        {
            var courseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.Model.CourseClassCode), cancellationToken);
            if (courseClass == null)
            {
                return Results.BadRequest($"Course class with code {request.Model.CourseClassCode} not found.");
            }
            var config = await subjectScheduleConfigRepository.FindOneAsync(
                new GetSubjectScheduleConfigSubjectCodeSpec(courseClass?.SemesterCode, courseClass.SubjectCode, [(SubjectTimelineStage)courseClass?.Stage]),
                cancellationToken);
            var slotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByCourseClassCodeSpec(request.Model.CourseClassCode), cancellationToken);
            var conditions = courseClass.CourseClassType == CourseClassType.Lecture
                ? config.TheorySessions
                : config.PracticeSessions;
                
                
            if (conditions.Length == slotTimelines?.Count)
            {
                // thong bao da du so buoi
                return Results.BadRequest($"Course class with code {request.Model.CourseClassCode} already has {conditions.Length} slot timelines.");
            }
            

            var slotTimeline = new SlotTimeline
            {
                CourseClassCode = request.Model.CourseClassCode,
                RoomCode = request.Model.RoomCode,
                DayOfWeek = request.Model.DayOfWeek,
                Slots = request.Model.Slots.ToList()
            };
            await slotTimelineRepository.AddAsync(slotTimeline, cancellationToken);
            return Results.NoContent();
        }
    }
}