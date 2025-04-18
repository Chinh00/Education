using System.ComponentModel;

namespace StudentService.Domain;

public class EducationProgram
{
    public string Code { get; set; }
    public string Name { get; set; }
    public int Type { get; set; }
    public float TrainingTime { get; set; }
    // public ICollection<KnowledgeBlockDescription> KnowledgeBlockDescriptions { get; set; }
    // public ICollection<EducationSubject> EducationSubjects { get; set; }

}