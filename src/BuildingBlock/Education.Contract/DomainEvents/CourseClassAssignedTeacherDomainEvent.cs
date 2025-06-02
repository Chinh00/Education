using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

[Description("Đã xếp giáo viên cho lớp học")]
public record CourseClassAssignedTeacherDomainEvent(string AggregateId, string TeacherCode, string TeacherName) : DomainEventBase
{
    
}