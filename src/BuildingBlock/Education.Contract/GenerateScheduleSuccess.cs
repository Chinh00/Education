using Education.Core.Domain;

namespace Education.Contract;

public class GenerateScheduleSuccess : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
}