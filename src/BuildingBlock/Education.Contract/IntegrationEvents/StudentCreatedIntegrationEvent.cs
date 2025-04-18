using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class StudentCreatedIntegrationEvent : IIntegrationEvent
{
    public string UserId { get; set; }
    public string StudentCode { get; set; }
}