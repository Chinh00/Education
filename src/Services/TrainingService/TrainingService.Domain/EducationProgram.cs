using System.ComponentModel;
using Education.Core.Domain;

namespace TrainingService.Domain;

[Description("Chương trình đào tạo")]
public class EducationProgram : BaseEntity
{
    
    public string Code { get; set; }
    public string Name { get; set; }
    public int Type { get; set; }
    public string CourseCode { get; set; }
    public string BrandCode { get; set; }
    public float TrainingTime { get; set; }
    public ICollection<KnowledgeBlockDescription> KnowledgeBlockDescriptions { get; set; }
    public ICollection<EducationSubject> EducationSubjects { get; set; }
    public string SpecialityPath { get; set; }
}