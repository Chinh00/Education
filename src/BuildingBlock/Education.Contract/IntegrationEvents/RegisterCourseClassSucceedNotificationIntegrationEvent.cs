using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record RegisterCourseClassSucceedNotificationIntegrationEvent(NotificationMessage Notification) : IIntegrationEvent
{
    
}