using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class WishListCreatedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
}