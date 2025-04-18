namespace RegisterStudy.Domain;

public class Subject
{
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public List<string> StudentCodes { get; set; }
}