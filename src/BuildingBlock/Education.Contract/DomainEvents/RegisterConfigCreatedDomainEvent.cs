using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Tạo mới cấu hình đăng ký nguyện vọng")]
public record RegisterConfigCreatedDomainEvent(string AggregateId, string SemesterCode, DateTime StartDate, DateTime EndDate, DateTime StudentChangeStart,
    DateTime StudentChangeEnd, DateTime EducationStart, DateTime EducationEnd, 
    int MinCredit, int MaxCredit) : DomainEventBase
{
    
}