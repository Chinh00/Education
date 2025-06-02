using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class StartRegisterPipelineIntegrationEvent : IIntegrationEvent
{
    public string EventStoreId { get; set; }
    public Guid CorrelationId { get; set; }
    public string SemesterCode { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime StudentChangeStart { get; set; } 
    public DateTime StudentChangeEnd { get; set; } 
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }

}