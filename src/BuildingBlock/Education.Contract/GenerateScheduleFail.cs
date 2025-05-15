using Education.Core.Domain;

namespace Education.Contract;

public class GenerateScheduleFail : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
}