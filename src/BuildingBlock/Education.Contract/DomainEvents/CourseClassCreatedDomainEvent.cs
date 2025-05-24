using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Tạo mới lớp học")]
public record CourseClassCreatedDomainEvent(string AggregateId, int ClassIndex, string CourseClassCode, string CourseClassName, int CourseClassType,
    string SubjectCode, int SessionLength, int Session, Guid CorrectionId, int DurationInWeeks,
    int MinDaySpaceLesson, string SemesterCode, int NumberStudents, int Stage) : DomainEventBase
{
    
}