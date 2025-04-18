using Education.Core.Domain;

namespace TrainingService.Domain;

public class Course : BaseEntity
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string CourseName { get; set; }
    public string CourseCode { get; set; }
}