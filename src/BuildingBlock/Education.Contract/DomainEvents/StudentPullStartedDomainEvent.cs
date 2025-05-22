using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

public record class StudentPullStartedDomainEvent(string StudentCode) : DomainEventBase
{
    
}