using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class SubjectRegisterCreatedDomainEventHandler(IMongoRepository<SubjectRegister> repository)
    : INotificationHandler<SubjectRegisterCreatedDomainEvent>
{
    public async Task Handle(SubjectRegisterCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new SubjectRegister()
        {
            Id = ObjectId.Parse(notification.AggregateId),
            CorrelationId = notification.CorrelationId,
            Version = notification.Version,
            SubjectCode = notification.SubjectCode,
            StudentCodes = notification.StudentCodes
        }, cancellationToken);
    }
}