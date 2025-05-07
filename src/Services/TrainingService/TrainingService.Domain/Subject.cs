using System.ComponentModel;
using Education.Core.Domain;

namespace TrainingService.Domain;

[Description("Môn học")]
public class Subject : BaseEntity
{
    public string SubjectName { get; set; }
    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    
    public string SubjectDescription { get; set; }
    public int NumberOfCredits { get; set; }
}