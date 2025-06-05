using System.ComponentModel;
using Education.Core.Domain;

namespace StudentService.Domain;

public class StudentSemester : BaseEntity

{
    public string StudentCode { get; set; }
    public string SemesterCode { get; set; }
    
    
    public ICollection<SubjectResult> SubjectResults { get; set; } = new List<SubjectResult>();
    public ICollection<string> CourseSubjects { get; set; } = [];

}