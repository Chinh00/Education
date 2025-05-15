using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class RegisterLockedIntegrationEvent : IIntegrationEvent
{
    public Guid CorrelationId { get; set; }
    public ICollection<StudentRegisterConfirm> Students { get; set; }
}

public class StudentRegisterConfirm
{
    public string EducationCode { get; set; }
    public string StudentCode { get; set; }
    public ICollection<string> SubjectCodes { get; set; }
    public DateTime RegisterDate { get; set; }
}