namespace RegisterStudy.Domain;

public class StudentRegister
{
    public string StudentCode { get; set; }
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }
    public ICollection<string> SubjectCodes { get; set; } = [];
}