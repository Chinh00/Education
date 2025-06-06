using System.ComponentModel;
using System.Text.Json.Serialization;
using Education.Core.Domain;

namespace StudentService.Domain;

public class StudentSemester : BaseEntity

{
    public string StudentCode { get; set; }
    public string SemesterCode { get; set; }
    
    [JsonIgnore]
    public ICollection<SubjectResult> SubjectResults { get; set; } = new List<SubjectResult>();
    public ICollection<string> CourseSubjects { get; set; } = [];

}