using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class RegisterConfigCreatedDomainEventConsumer(
    ITopicProducer<StartRegisterPipelineIntegrationEvent> producer,
    ITopicProducer<StartRegisterNotificationIntegrationEvent> producerNotification)
    : INotificationHandler<RegisterConfigCreatedDomainEvent>
{
    public async Task Handle(RegisterConfigCreatedDomainEvent notification, CancellationToken cancellationToken)
    {

        await producer.Produce(new StartRegisterPipelineIntegrationEvent()
        {
            CorrelationId = Guid.NewGuid(),
            SemesterCode = notification.SemesterCode,
            WishStartDate = notification.StartDate,
            WishEndDate = notification.EndDate,
            MinCredit = notification.MinCredit,
            MaxCredit = notification.MaxCredit,
            EventStoreId = notification.AggregateId
        }, cancellationToken);
        await producerNotification.Produce(new StartRegisterNotificationIntegrationEvent(new NotificationMessage()
        {
            Title = $"Đăng ký nguyện vọng học học kỳ {notification?.SemesterCode}",
            Content = $"Học kỳ {notification?.SemesterCode} đã được mở đăng ký nguyện vọng. " +
                      $"Thời gian đăng ký từ {notification?.StartDate:dd/MM/yyyy} đến {notification?.EndDate:dd/MM/yyyy}. " +
                      $"Số tín chỉ tối thiểu là {notification?.MinCredit}, tối đa là {notification?.MaxCredit}.",
            Roles = ["student", "admin", "department-admin"]
        }), cancellationToken);

    }
}