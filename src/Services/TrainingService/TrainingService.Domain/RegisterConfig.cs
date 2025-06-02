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
    public DateTime StudentChangeStart { get; set; } 
    public DateTime StudentChangeEnd { get; set; } 
    
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }

    public void Create(string semesterCode, DateTime startDate, DateTime endDate, DateTime studentChangeStart,
        DateTime studentChangeEnd, 
        int minCredit, int maxCredit, IDictionary<string, object> metaData = null)
    {
        SemesterCode = semesterCode;
        StartDate = startDate;
        EndDate = endDate;
        MinCredit = minCredit;
        MaxCredit = maxCredit;
        StudentChangeStart = studentChangeStart;
        StudentChangeEnd = studentChangeEnd;
        AddDomainEvent(version =>
            new RegisterConfigCreatedDomainEvent(Id.ToString(), semesterCode, startDate, endDate, studentChangeStart,
                studentChangeEnd, minCredit, maxCredit)
        {
            Version = version,
            MetaData = metaData
        });    
    }
    
}