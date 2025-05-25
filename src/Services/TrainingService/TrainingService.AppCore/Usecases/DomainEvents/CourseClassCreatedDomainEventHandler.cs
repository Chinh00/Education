using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class CourseClassCreatedDomainEventHandler(IMongoRepository<CourseClass> repository)
    : INotificationHandler<CourseClassCreatedDomainEvent>
{
    public async Task Handle(CourseClassCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new CourseClass()
        {
            Id = ObjectId.Parse(notification.AggregateId),
            Version = notification.Version,
            CourseClassCode = notification.CourseClassCode,
            CourseClassName = notification.CourseClassName,
            CourseClassType = (CourseClassType)notification.CourseClassType,
            SubjectCode = notification.SubjectCode,
            SessionLength = notification.SessionLength,
            Session = notification.Session,
            Stage = (SubjectTimelineStage)notification.Stage,
            TotalSession = notification.TotalSession,
            SemesterCode = notification.SemesterCode,
        }, cancellationToken);
    }
}