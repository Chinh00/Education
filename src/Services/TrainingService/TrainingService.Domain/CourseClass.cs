using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : BaseEntity
{
    public int ClassIndex { get; set; } 
    public List<string> StudentIds { get; set; }
    public CourseClassType CourseClassType { get; set; }
    public string SubjectCode { get; set; }
}