using Education.Core.Domain;

namespace TrainingService.Domain;

public class StudentRegister : BaseEntity
{
    public string StudentCode { get; set; }
    public Guid CorrelationId { get; set; }
    public ICollection<string> SubjectCodes { get; set; } = [];
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }
}