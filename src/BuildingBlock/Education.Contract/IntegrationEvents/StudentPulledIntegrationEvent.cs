using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record StudentPulledIntegrationEvent(string UserName) : IIntegrationEvent
{
    
}

