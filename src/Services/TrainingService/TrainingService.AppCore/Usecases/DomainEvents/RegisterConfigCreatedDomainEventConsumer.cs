using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class RegisterConfigCreatedDomainEventConsumer(
    ITopicProducer<StartRegisterPipelineIntegrationEvent> producer)
    : INotificationHandler<RegisterConfigCreatedDomainEvent>
{
    public async Task Handle(RegisterConfigCreatedDomainEvent notification, CancellationToken cancellationToken)
    {

        await producer.Produce(new StartRegisterPipelineIntegrationEvent()
        {
            CorrelationId = Guid.NewGuid(),
            SemesterCode = notification.SemesterCode,
            StartDate = notification.StartDate,
            EndDate = notification.EndDate,
            StudentChangeStart = notification.StudentChangeStart,
            StudentChangeEnd = notification.StudentChangeEnd,
            EducationStart = notification.EducationStart,
            EducationEnd = notification.EducationEnd,
            EventStoreId = notification.AggregateId
        }, cancellationToken);

    }
}