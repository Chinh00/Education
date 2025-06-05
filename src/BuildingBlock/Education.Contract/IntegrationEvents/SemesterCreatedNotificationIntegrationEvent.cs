using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record SemesterCreatedNotificationIntegrationEvent(NotificationMessage Notification) : IIntegrationEvent
{
    
}