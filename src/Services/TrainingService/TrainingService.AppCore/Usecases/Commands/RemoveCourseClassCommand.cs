using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record RemoveCourseClassCommand(string CourseClassCode) : ICommand<IResult>
{
    internal class Handler(
        IMongoRepository<CourseClass> courseClassRepository,
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<SlotTimeline> slotTimelineRepository) : IRequestHandler<RemoveCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(RemoveCourseClassCommand request, CancellationToken cancellationToken)
        {
            var courseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.CourseClassCode), cancellationToken);
            if (courseClass == null)
            {
                return Results.BadRequest($"Course class with code {request.CourseClassCode} not found.");
            }
            
            var spec = new GetSlotTimelineByCourseClassCodeSpec(courseClass.CourseClassCode);
            var slotTimelines = await slotTimelineRepository.FindAsync(spec, cancellationToken);
            foreach (var slotTimeline in slotTimelines)
            {
                await slotTimelineRepository.RemoveOneAsync(new GetSlotTimelineByCourseClassCodeSpec(slotTimeline.CourseClassCode), cancellationToken);
            }
            await courseClassRepository.RemoveOneAsync(new GetCourseClassByCodeSpec(request.CourseClassCode), cancellationToken);
            return Results.NoContent();
        }
    }
}