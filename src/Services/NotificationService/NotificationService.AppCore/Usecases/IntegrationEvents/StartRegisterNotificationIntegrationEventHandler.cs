﻿using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using NotificationService.Domain;

namespace NotificationService.AppCore.Usecases.IntegrationEvents;

public class StartRegisterNotificationIntegrationEventHandler(IMongoRepository<Notification> repository)
    : INotificationHandler<StartRegisterNotificationIntegrationEvent>
{
    public async Task Handle(StartRegisterNotificationIntegrationEvent notification, CancellationToken cancellationToken)
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