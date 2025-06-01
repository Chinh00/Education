namespace RegisterStudy.Domain;

public class RegisterCourse
{
    public string RegisterCode { get; set; }
    public string SemesterCode { get; set; }
    
    public DateTime StaDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
}