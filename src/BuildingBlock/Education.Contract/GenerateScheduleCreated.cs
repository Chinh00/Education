using Education.Core.Domain;

namespace Education.Contract;

public class GenerateScheduleCreated : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
}