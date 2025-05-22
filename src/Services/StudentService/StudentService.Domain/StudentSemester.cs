using System.ComponentModel;
using Education.Core.Domain;

namespace StudentService.Domain;

public class StudentSemester : BaseEntity
{
    public string StudentCode { get; set; }
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    
    [Description("Thời gian bắt đầu kì học")]
    public DateTime EducationStartDate { get; set; }
    
    [Description("Thời gian kết thúc kì học")]
    public DateTime EducationEndDate { get; set; }
    
    [Description("Thời gian kết thúc kì học")]
    public DateTime StartDate { get; set; }
    [Description("Thời gian kết thúc kì học")]
    public DateTime EndDate { get; set; }
    public ICollection<SubjectResult> SubjectResults { get; set; } = new List<SubjectResult>();
    public ICollection<CourseSubject> CourseSubjects { get; set; } = new List<CourseSubject>();
}