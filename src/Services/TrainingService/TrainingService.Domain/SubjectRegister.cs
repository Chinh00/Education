using Education.Core.Domain;

namespace TrainingService.Domain;

public class SubjectRegister : BaseEntity
{
    public string SubjectCode { get; set; }
    public string SemesterCode { get; set; }
    public List<string> StudentCodes { get; set; }
    
    
}