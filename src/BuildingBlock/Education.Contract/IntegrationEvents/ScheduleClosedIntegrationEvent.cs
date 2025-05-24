using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class ScheduleClosedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
}