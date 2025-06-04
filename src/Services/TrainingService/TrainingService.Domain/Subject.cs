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
    
    [Description("Số tiết lý thuyết")]
    public int LectureTotal { get; set; }
    [Description("Số buổi lý thuyết trong 1 tuần")]
    public int LectureLesson { get; set; }
    [Description("Số tiết lý thuyết trong 1 buổi")]
    public int LecturePeriod { get; set; }
    
    [Description("Số tiết thực hành")]
    public int LabTotal { get; set; }
    [Description("Số buổi thực hành trong 1 tuần")]
    public int LabLesson { get; set; }
    [Description("Số tiết thực hành trong 1 buổi")]
    public int LabPeriod { get; set; }
    
    public List<string> LectureRequiredConditions { get; set; } = [];
    public List<string> LabRequiredConditions { get; set; } = [];
    
}