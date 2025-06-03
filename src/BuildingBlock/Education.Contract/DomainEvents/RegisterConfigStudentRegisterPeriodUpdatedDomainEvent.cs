using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

[Description("Cập nhật thời gian đăng ký lớp học phần sinh viên")]
public record RegisterConfigStudentRegisterPeriodUpdatedDomainEvent(
    string AggregateId,
    string SemesterCode,
    DateTime StudentRegisterStart,
    DateTime StudentRegisterEnd) : DomainEventBase
{
    
}