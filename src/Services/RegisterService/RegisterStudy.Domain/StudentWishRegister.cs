using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;

namespace RegisterStudy.Domain;

public class StudentWishRegister : AggregateBase
{
    public string StudentCode { get; set; }
    public string EducationCode { get; set; }
    public DateTime RegisterDate { get; set; }
    public ICollection<string> SubjectCodes { get; set; } = [];
    
    public void CreateStudentRegister(string studentCode, DateTime registerDate, string educationCode,
        ICollection<string> subjectCodes, IDictionary<string, object> metadata = null)
    {
        StudentCode = studentCode;
        RegisterDate = registerDate;
        EducationCode = educationCode;
        SubjectCodes = subjectCodes;
        AddDomainEvent(version => new StudentRegisterCreatedDomainEvent(Id.ToString(), studentCode, registerDate, educationCode, subjectCodes)
        {
            Version =  version,
            MetaData = metadata
        });
    }

    public void ChangeSubjectCode(ICollection<string> subjectCodes, IDictionary<string, object> metadata = null)
    {
        SubjectCodes = subjectCodes;
        AddDomainEvent(version => new SubjectRegisterChangedDomainEvent(Id.ToString(), StudentCode, EducationCode, SubjectCodes)
        {
            Version = version,
            MetaData = metadata
        });
    }

    public override void ApplyDomainEvent(IDomainEvent @event) => Apply((dynamic)@event);

    void Apply(StudentRegisterCreatedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        StudentCode = @event.StudentCode;
        RegisterDate = @event.RegisterDate;
        EducationCode = @event.EducationCode;
        SubjectCodes = @event.SubjectCodes;
        Version = @event.Version;
    }

    void Apply(SubjectRegisterChangedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        SubjectCodes = @event.SubjectCode;
        Version = @event.Version;       
    }
}