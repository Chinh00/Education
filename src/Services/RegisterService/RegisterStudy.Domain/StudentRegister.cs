namespace RegisterStudy.Domain;

public class StudentRegister
{
    public string StudentCode { get; set; }
    public List<string> CourseClassCode { get; set; } = [];
}