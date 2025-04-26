namespace TrainingService.Domain;

public class SubjectRegister
{
    public ICollection<string> SubjectCodes { get; set; } = [];
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }
}