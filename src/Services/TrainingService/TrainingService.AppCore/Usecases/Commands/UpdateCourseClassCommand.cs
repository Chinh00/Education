using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record UpdateCourseClassCommand(UpdateCourseClassCommand.UpdateCourseClassCommandModel Model) : ICommand<IResult>
{
    public record struct UpdateCourseClassCommandModel(string CourseClassCode, string CourseClassName, int NumberStudentsExpected, int WeekStart);
    
    internal class Handler(
        IMongoRepository<CourseClass> courseClassRepository,
        IClaimContextAccessor claimContextAccessor
    ) : IRequestHandler<UpdateCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateCourseClassCommand request, CancellationToken cancellationToken)
        {
            var courseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.Model.CourseClassCode), cancellationToken);
            if (courseClass == null)
            {
                return Results.BadRequest($"Course class with code {request.Model.CourseClassName} not found.");
            }

            courseClass.CourseClassName = request.Model.CourseClassName;
            courseClass.NumberStudentsExpected = request.Model.NumberStudentsExpected;
            courseClass.WeekStart = request.Model.WeekStart;

            await courseClassRepository.UpsertOneAsync(new GetCourseClassByCodeSpec(request.Model.CourseClassCode), courseClass, cancellationToken);
            return Results.NoContent();
        }
    }
    
}