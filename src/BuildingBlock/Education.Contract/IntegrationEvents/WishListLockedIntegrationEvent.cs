using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class WishListLockedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
    public int NumberStudent { get; set; }
    public int NumberSubject { get; set; }
    public int NumberWish { get; set; }
}