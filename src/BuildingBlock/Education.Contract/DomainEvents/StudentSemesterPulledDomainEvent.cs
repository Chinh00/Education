using Education.Core.Domain;

namespace Education.Contract.DomainEvents;

public record StudentSemesterPulledDomainEvent(string AggregateId, string StudentCode, string SemesterCode, string SemesterName, DateTime EducationStartDate,
    DateTime EducationEndDate, List<SubjectResultEvent> SubjectResult, List<CourseSubjectEvent> CourseSubject) : DomainEventBase
{
    
}
public class SubjectResultEvent
{
    public string SubjectName { get; set; }
    public double? Coeffiecient { get; set; }

    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    public int NumberOfCredits { get; set; }
    public decimal Mark { get; set; }
    public decimal OriginalMark { get; set; }
    public int ExamRound { get; set; }
    

    public string Description { get; set; }
    public int SubjectMarkType { get; set; }
    public string MarkTypeChar { get; set; }
    public int? Result { get; set; }
}
public class CourseSubjectEvent
{
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public string CourseClassName { get; set; }
    public string CourseClassCode { get; set; }
    public string TeacherCode { get; set; }
    public string TeacherName { get; set; }
}