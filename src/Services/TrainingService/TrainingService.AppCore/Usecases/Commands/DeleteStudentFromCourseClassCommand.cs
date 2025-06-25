using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record DeleteStudentFromCourseClassCommand(DeleteStudentFromCourseClassCommand.DeleteStudentFromCourseClassModel Model) : ICommand<IResult>
{
    public record struct DeleteStudentFromCourseClassModel(string CourseClassCode, string StudentCode);
    
    internal class Handler(IMongoRepository<CourseClass> repository, ITopicProducer<StudentEvictedIntegrationEvent> producer)
        : IRequestHandler<DeleteStudentFromCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(DeleteStudentFromCourseClassCommand request, CancellationToken cancellationToken)
        {
            var spec = new GetCourseClassByCodeSpec(request.Model.CourseClassCode);
            var courseClass = await repository.FindOneAsync(spec, cancellationToken);
            if (courseClass == null) return Results.NotFound();
            var student = courseClass.StudentIds.Contains(request.Model.StudentCode);
            if (student)
            {
                courseClass.StudentIds.Remove(request.Model.StudentCode);
            }
            else
            {
                return Results.NotFound();
            }
            await repository.UpsertOneAsync(spec, courseClass, cancellationToken);
            await producer.Produce(new StudentEvictedIntegrationEvent(
                courseClass?.SemesterCode,
                request.Model.StudentCode, request.Model.CourseClassCode), cancellationToken);
            return Results.NoContent();
        }
    }
}