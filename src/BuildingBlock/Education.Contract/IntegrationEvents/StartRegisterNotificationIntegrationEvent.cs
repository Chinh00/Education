using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record StartRegisterNotificationIntegrationEvent(NotificationMessage Notification) : IIntegrationEvent
{
    
}