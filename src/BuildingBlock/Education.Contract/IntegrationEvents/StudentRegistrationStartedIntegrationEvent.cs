using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class StudentRegistrationStartedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
    public DateTime StudentRegisterStartDate { get; set; }
    public DateTime StudentRegisterEndDate { get; set; }
}