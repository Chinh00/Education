using Education.Contract.DomainEvents;
using Education.Core.Domain;

namespace TrainingService.Domain;

public class RegisterConfig : AggregateBase
{
    public string CurrentState { get; set; } 
    public string SemesterCode { get; set; } 
    public string SemesterName { get; set; } 
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
    public Guid? CorrelationId { get; set; }
    

    public void CreateRegisterConfig(string semesterCode, string semesterName, DateTime startDate, DateTime endDate,
        int minCredit, int maxCredit, IDictionary<string, object> metaData = null)
    {
        SemesterName = semesterName;
        SemesterCode = semesterCode;
        StartDate = startDate;
        EndDate = endDate;
        MinCredit = minCredit;
        MaxCredit = maxCredit;
        AddDomainEvent(version =>
            new RegisterConfigCreatedDomainEvent(Id.ToString(), semesterCode, semesterName, startDate, endDate,
                minCredit, maxCredit)
        {
            Version = version,
            MetaData = metaData
        });    
    }

    public override void ApplyDomainEvent(IDomainEvent @event) => Apply((dynamic)@event);

    void Apply(RegisterConfigCreatedDomainEvent @event)
    {
        SemesterName = @event.SemesterName;
        SemesterCode = @event.SemesterCode;
        StartDate = @event.StartDate;
        EndDate = @event.EndDate;
        MinCredit = @event.MinCredit;
        MaxCredit = @event.MaxCredit;
        Version = @event.Version;
    }
}