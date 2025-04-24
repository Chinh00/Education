namespace RegisterStudy.Domain;

public class StudentRegister
{
    public string StudentCode { get; set; }
    public ICollection<SubjectRegister> Subjects { get; set; }
}