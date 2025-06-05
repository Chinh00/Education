using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using NotificationService.Domain;

namespace NotificationService.AppCore.Usecases.IntegrationEvents;

public class SemesterCreatedNotificationIntegrationEventHandler(IMongoRepository<Notification> repository) : INotificationHandler<SemesterCreatedNotificationIntegrationEvent>
{
    public async Task Handle(SemesterCreatedNotificationIntegrationEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new Notification()
        {
            Title = notification.Notification.Title,
            Content = notification.Notification.Content,
            Roles = notification.Notification.Roles,
            Recipients = notification.Notification.Recipients
        }, cancellationToken);
    }
}