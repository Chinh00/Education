
using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class Semester : BaseEntity
{
    public string SemesterName { get; set; }
    public string SemesterCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public string ParentSemesterCode { get; set; }
    
    
    
    public SemesterStatus SemesterStatus { get; set; } = SemesterStatus.New;

    

   
    
    
    
    
}