using Education.Core.Domain;

namespace TrainingService.Domain;

public class Course : BaseEntity
{
    public string CourseName { get; set; }
    public string CourseCode { get; set; }
}