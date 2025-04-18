using System.ComponentModel;

namespace StudentService.Domain;
[Description("Môn học")]
public class SubjectDetail
{
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public string TeacherCode { get; set; }
    public string TeacherName { get; set; }
}