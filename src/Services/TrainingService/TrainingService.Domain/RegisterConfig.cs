using System.ComponentModel;
using Education.Contract.DomainEvents;
using Education.Core.Domain;

namespace TrainingService.Domain;

public class RegisterConfig : AggregateBase
{
    public string SemesterCode { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    
    [Description("Thời gian sinh viên thay đổi")]
    public DateTime StudentRegisterStart { get; set; } 
    public DateTime StudentRegisterEnd { get; set; } 
    
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }

    public void Create(string semesterCode, DateTime wishStartDate, DateTime wishEndDate, 
        int minCredit, int maxCredit, IDictionary<string, object> metaData = null)
    {
        SemesterCode = semesterCode;
        StartDate = wishStartDate;
        EndDate = wishEndDate;
        MinCredit = minCredit;
        MaxCredit = maxCredit;
        AddDomainEvent(version =>
            new RegisterConfigCreatedDomainEvent(Id.ToString(), semesterCode, wishStartDate, wishEndDate, minCredit, maxCredit)
        {
            Version = version,
            MetaData = metaData
        });    
    }
    
}