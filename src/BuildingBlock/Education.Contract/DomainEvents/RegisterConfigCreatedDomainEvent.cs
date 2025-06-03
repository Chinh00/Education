using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Tạo mới cấu hình đăng ký nguyện vọng")]
public record RegisterConfigCreatedDomainEvent(
    string AggregateId,
    string SemesterCode,
    DateTime StartDate,
    DateTime EndDate,
    int MinCredit, int MaxCredit) : DomainEventBase
{
    
}