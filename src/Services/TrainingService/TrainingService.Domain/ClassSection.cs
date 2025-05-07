using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class ClassSection : BaseEntity
{
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public string ClassSectionCode { get; set; }
    public string ClassSectionName { get; set; }
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    public ClassSectionStatus ClassSectionStatus { get; set; }
}