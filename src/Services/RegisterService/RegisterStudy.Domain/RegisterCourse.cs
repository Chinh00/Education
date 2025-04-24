namespace RegisterStudy.Domain;

public class RegisterCourse
{
    public string CourseName { get; set; }
    public string CourseCode { get; set; }
    public string EducationCode { get; set; }
    public string EducationName { get; set; }
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    public ICollection<SubjectRegister> Subjects { get; set; }
}