using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record UpdateCourseClassStatusCommand(UpdateCourseClassStatusCommand.UpdateCourseClassStatusModel Model) : ICommand<IResult>
{
    public record struct UpdateCourseClassStatusModel(
        string CourseClassCode,
        CourseClassStatus Status);
    internal class Handler(IMongoRepository<CourseClass> repository)
        : IRequestHandler<UpdateCourseClassStatusCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateCourseClassStatusCommand request, CancellationToken cancellationToken)
        {
            var spec = new GetCourseClassByCodeSpec(request.Model.CourseClassCode);
            var courseClass = await repository.FindOneAsync(spec, cancellationToken);
            if (courseClass == null) return Results.NotFound();
            courseClass.Status = request.Model.Status;
            await repository.UpsertOneAsync(spec, courseClass, cancellationToken);
            return Results.NoContent();
        }
    }
}