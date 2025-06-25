using StudentService.Domain.Enums;

namespace StudentService.Domain;

public class StudentSubject
{
    public string CourseClassCode { get; set; }
    public StudentSubjectStatus Status { get; set; } = StudentSubjectStatus.Active;
}