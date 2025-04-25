using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class WishListLockedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
}