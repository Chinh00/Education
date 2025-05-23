using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

public record StudentPullStartedDomainEvent(string StudentCode) : DomainEventBase
{
    
}