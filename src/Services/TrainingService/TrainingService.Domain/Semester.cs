
using Education.Core.Domain;
using MongoDB.Bson;

namespace TrainingService.Domain;

public class Semester : BaseEntity
{
    public string SemesterName { get; set; }
    public string SemesterCode { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}