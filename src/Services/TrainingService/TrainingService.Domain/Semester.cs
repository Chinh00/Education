
using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class Semester : AggregateBase
{
    public string SemesterName { get; set; }
    public string SemesterCode { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public SemesterStatus SemesterStatus { get; set; } = SemesterStatus.New;

    public void CreateSemester(string semesterName, string semesterCode, DateTime startDate, DateTime endDate,
        IDictionary<string, object> metaData = null)
    {
        SemesterName = semesterName;
        SemesterCode = semesterCode;
        StartDate = startDate;
        EndDate = endDate;
        AddDomainEvent(version => new SemesterCreatedDomainEvent(Id.ToString(), semesterName, semesterCode, startDate, endDate)
        {
            MetaData = metaData,
            Version = version
        });
    }

    public void ChangeSemesterStatus(SemesterStatus semesterStatus, IDictionary<string, object> metaData = null)
    {
        SemesterStatus = semesterStatus;
        AddDomainEvent(version => new SemesterStatusChangedDomainEvent(Id.ToString(), SemesterCode, (int)semesterStatus)
        {
            MetaData = metaData,
            Version = version
        });
    }

    public override void ApplyDomainEvent(IDomainEvent @event) => Apply((dynamic)@event);

    private void Apply(SemesterCreatedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.Id);
        SemesterName = @event.SemesterName;
        SemesterCode = @event.SemesterCode;
        StartDate = @event.StartDate;
        EndDate = @event.EndDate;
        Version = @event.Version;
    }
    private void Apply(SemesterStatusChangedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.Id);
        SemesterStatus = (SemesterStatus)@event.Status;
        Version = @event.Version;
    }
    
    
    
}