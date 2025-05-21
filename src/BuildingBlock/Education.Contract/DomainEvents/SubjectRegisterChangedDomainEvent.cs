using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

public record SubjectRegisterChangedDomainEvent(
    string AggregateId,
    string StudentCode,
    string EducationCode,
    ICollection<string> SubjectCode) : DomainEventBase
{
    
}