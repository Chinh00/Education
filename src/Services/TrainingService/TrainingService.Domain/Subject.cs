using System.ComponentModel;
using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

[Description("Môn học")]
public class Subject : BaseEntity
{
    public string SubjectName { get; set; }
    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    public string SubjectDescription { get; set; }
    public int NumberOfCredits { get; set; }
    public string DepartmentCode { get; set; }

    [Description("Là môn tính điểm")]
    public bool? IsCalculateMark { get; set; }


    public SubjectStatus Status { get; set; } = SubjectStatus.Current;
}