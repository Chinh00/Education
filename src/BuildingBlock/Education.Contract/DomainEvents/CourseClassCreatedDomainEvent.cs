using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Tạo mới lớp học")]
public record CourseClassCreatedDomainEvent(string AggregateId, string CourseClassCode, string CourseClassName, int CourseClassType,
    string SubjectCode, int SessionLength, int Session, int TotalSession, string SemesterCode, int Stage) : DomainEventBase
{
    
}