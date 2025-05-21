using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class RegisterConfigCreatedDomainEventConsumer(
    IMongoRepository<RegisterConfig> repository,
    ITopicProducer<StartRegisterPipelineIntegrationEvent> producer)
    : INotificationHandler<RegisterConfigCreatedDomainEvent>
{
    public async Task Handle(RegisterConfigCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        var correlationId = Guid.NewGuid();
        await repository.AddAsync(new RegisterConfig()
        {
            CorrelationId = correlationId,
            Id = ObjectId.Parse(notification.AggregateId),
            Version = notification.Version,
            SemesterCode = notification.SemesterCode,
            SemesterName = notification.SemesterName,
            StartDate = notification.StartDate,
            EndDate = notification.EndDate,
            MinCredit = notification.MinCredit,
            MaxCredit = notification.MaxCredit,
        }, cancellationToken);
        
        await producer.Produce(new
        {
            CorrelationId = correlationId,
            notification.MinCredit,
            notification.MaxCredit,
            notification.StartDate,
            notification.EndDate,
            notification.SemesterCode,
            notification.SemesterName,
        }, cancellationToken);
        
    }
}