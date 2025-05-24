using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

[Description("Sinh viên đăng ký học")]
public record SubjectRegisterCreatedDomainEvent(
    string AggregateId,
    string SubjectCode,
    Guid CorrelationId,
    List<string> StudentCodes) : DomainEventBase
{
    
}