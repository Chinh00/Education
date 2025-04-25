namespace RegisterStudy.Domain;

public class SubjectRegister
{
    public List<string> SubjectCodes { get; set; } = [];
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }

}