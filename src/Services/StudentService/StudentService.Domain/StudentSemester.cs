using System.ComponentModel;
using Education.Contract.DomainEvents;
using Education.Core.Domain;

namespace StudentService.Domain;

public class StudentSemester : AggregateBase
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

    public void Create(string studentCode, string semesterCode, string semesterName, DateTime educationStartDate,
        DateTime educationEndDate, List<SubjectResult> subjectResults, List<CourseSubject> courseSubjects, IDictionary<string, object> metadata = null)
    {
        AddDomainEvent(version => new StudentSemesterPulledDomainEvent(Id.ToString(), studentCode, semesterCode,
            semesterName, educationStartDate, educationEndDate, subjectResults.Select(c => new SubjectResultEvent()
        {
            SubjectName = c.SubjectName,
            Coeffiecient = c.Coeffiecient,
            SubjectNameEng = c.SubjectNameEng,
            SubjectCode = c.SubjectCode,
            NumberOfCredits = c.NumberOfCredits,
            Mark = c.Mark,
            OriginalMark = c.OriginalMark,
            ExamRound = c.ExamRound,
            Description = c.Description,
            SubjectMarkType = (int)c.SubjectMarkType,
            MarkTypeChar = c.MarkTypeChar,
            Result = c.Result,
        }).ToList(), courseSubjects.Select(c => new CourseSubjectEvent()
            {
                SubjectCode = c.SubjectCode,
                SubjectName = c.SubjectName,
                CourseClassName = c.CourseClassName,
                CourseClassCode = c.CourseClassCode,
                TeacherCode = c.TeacherCode,
                TeacherName = c.TeacherName,
                
            }).ToList())
        {
            Version = version,
            MetaData = metadata
        });
    }
    
}