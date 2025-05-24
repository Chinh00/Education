using Education.Contract.DomainEvents;
using Education.Core.Domain;

namespace TrainingService.Domain;

public class SubjectRegister : AggregateBase
{
    public string SubjectCode { get; set; }
    public Guid CorrelationId { get; set; }
    public List<string> StudentCodes { get; set; }
    
    public void Create(string subjectCode, Guid correlationId, List<string> studentCodes,
        IDictionary<string, object> metaData = null)
    {
        SubjectCode = subjectCode;
        CorrelationId = correlationId;
        StudentCodes = studentCodes;
        AddDomainEvent(version =>
            new SubjectRegisterCreatedDomainEvent(Id.ToString(), subjectCode, correlationId, studentCodes)
        {
            Version = version,
            MetaData = metaData
        });
    }
}