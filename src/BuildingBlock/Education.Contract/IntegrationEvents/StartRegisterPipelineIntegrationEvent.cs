using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class StartRegisterPipelineIntegrationEvent : IIntegrationEvent
{
    public string EventStoreId { get; set; }
    public Guid CorrelationId { get; set; }
    public string SemesterCode { get; set; }
    
    public DateTime WishStartDate { get; set; }
    public DateTime WishEndDate { get; set; }
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }

}