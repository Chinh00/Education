using Education.Contract.DomainEvents;
using Education.Core.Repository;
using Education.Core.Specification;
using MediatR;
using MongoDB.Bson;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class CourseClassAssignedTeacherDomainEventHandler(IMongoRepository<CourseClass> repository)
    : INotificationHandler<CourseClassAssignedTeacherDomainEvent>
{
    public async Task Handle(CourseClassAssignedTeacherDomainEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetEntityByIdSpec<CourseClass>(ObjectId.Parse(notification.AggregateId));
        var courseClass = await repository.FindOneAsync(spec, cancellationToken);
        courseClass.TeacherCode = notification.TeacherCode;
        courseClass.TeacherName =  notification.TeacherName;
        await repository.UpsertOneAsync(spec, courseClass, cancellationToken);
    }
}