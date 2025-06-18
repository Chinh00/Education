using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record RemoveSlotTimelineCommand(string CourseClassCode, string SlotTimelineId) : ICommand<IResult>
{
    internal class Handler(
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository)
        : IRequestHandler<RemoveSlotTimelineCommand, IResult>
    {
        public async Task<IResult> Handle(RemoveSlotTimelineCommand request, CancellationToken cancellationToken)
        {
            var courseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.CourseClassCode), cancellationToken);
            if (courseClass == null)
            {
                return Results.BadRequest($"Course class with code {request.CourseClassCode} not found.");
            }
            var slotTimeline = await slotTimelineRepository.FindOneAsync(
                new GetSlotTimelineByIdAndCourseClassCodeSpec(ObjectId.Parse(request.SlotTimelineId),
                    request.CourseClassCode), cancellationToken);
            if (slotTimeline == null)
            {
                return Results.NotFound($"Slot timeline with id {request.SlotTimelineId} not found.");
            }

            await slotTimelineRepository.RemoveOneAsync(
                new GetSlotTimelineByIdAndCourseClassCodeSpec(ObjectId.Parse(request.SlotTimelineId),
                    request.CourseClassCode), cancellationToken);
            return Results.NoContent();
        }
    }
}