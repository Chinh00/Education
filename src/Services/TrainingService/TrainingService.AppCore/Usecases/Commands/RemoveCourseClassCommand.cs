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
        IClaimContextAccessor claimContextAccessor
        ) : IRequestHandler<RemoveCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(RemoveCourseClassCommand request, CancellationToken cancellationToken)
        {
            var courseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.CourseClassCode), cancellationToken);
            if (courseClass == null)
            {
                return Results.BadRequest($"Course class with code {request.CourseClassCode} not found.");
            }

            await courseClassRepository.RemoveOneAsync(new GetCourseClassByCodeSpec(request.CourseClassCode), cancellationToken);
            return Results.NoContent();
        }
    }
}