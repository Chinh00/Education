using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Sinh viên đăng ký nguyện vọng học")]
public record StudentRegisterCreatedDomainEvent(
    string AggregateId,
    string StudentCode,
    DateTime RegisterDate,
    string EducationCode,
    ICollection<string> SubjectCodes) : DomainEventBase
{
    
}