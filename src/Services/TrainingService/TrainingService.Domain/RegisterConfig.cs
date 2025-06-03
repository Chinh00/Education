using System.ComponentModel;
using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;

namespace TrainingService.Domain;

public class RegisterConfig : AggregateBase
{
    public string SemesterCode { get; set; }

    public DateTime WishStartDate { get; set; }
    public DateTime WishEndDate { get; set; }
    
    
    [Description("Thời gian sinh viên thay đổi")]
    public DateTime StudentRegisterStart { get; set; } 
    public DateTime StudentRegisterEnd { get; set; } 
    
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
    
    
    public void UpdateStudentRegisterPeriod(DateTime studentRegisterStart, DateTime studentRegisterEnd,
        IDictionary<string, object> metaData = null)
    {
        StudentRegisterStart = studentRegisterStart;
        StudentRegisterEnd = studentRegisterEnd;
        AddDomainEvent(version => new RegisterConfigStudentRegisterPeriodUpdatedDomainEvent(Id.ToString(), SemesterCode,
            studentRegisterStart, studentRegisterEnd)
        {
            Version = version,
            MetaData = metaData
        });
    }

    public void Create(string semesterCode, DateTime wishStartDate, DateTime wishEndDate, 
        int minCredit, int maxCredit, IDictionary<string, object> metaData = null)
    {
        SemesterCode = semesterCode;
        WishStartDate = wishStartDate;
        WishEndDate = wishEndDate;
        MinCredit = minCredit;
        MaxCredit = maxCredit;
        AddDomainEvent(version =>
            new RegisterConfigCreatedDomainEvent(Id.ToString(), semesterCode, wishStartDate, wishEndDate, minCredit, maxCredit)
        {
            Version = version,
            MetaData = metaData
        });    
    }

    public override void ApplyDomainEvent(IDomainEvent @event) => Apply((dynamic)@event);
    void Apply(RegisterConfigCreatedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        SemesterCode = @event.SemesterCode;
        WishStartDate = @event.StartDate;
        WishEndDate = @event.EndDate;
        MinCredit = @event.MinCredit;
        MaxCredit = @event.MaxCredit;
        Version = @event.Version;
    }
    void Apply(RegisterConfigStudentRegisterPeriodUpdatedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        StudentRegisterStart = @event.StudentRegisterStart;
        StudentRegisterEnd = @event.StudentRegisterEnd;
        Version = @event.Version;
    }
}