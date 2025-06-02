using System.ComponentModel;
using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class SubjectTimelineConfig : BaseEntity
{
    public string SubjectCode { get; set; }
    [Description("Tổng số tiết học")]
    public int PeriodTotal { get; set; }
    
    
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

    [Description("Khoảng cách giữa các buổi học lý thuyết trong 1 tuần")]
    public int MinDaySpaceLecture { get; set; } = 1;
    [Description("Khoảng cách giữa các buổi học thực hành trong 1 tuần")]
    public int MinDaySpaceLab { get; set; } = 1;
    
    [Description("Số sinh viên tối thiểu trong lớp lý thuyết")]
    public int LectureMinStudent { get; set; }
    [Description("Số sinh viên tối thiểu trong lớp thực hành")]
    public int LabMinStudent { get; set; }

    [Description("Tuần bắt đầu học lý thuyết (1, 2, 3, ...)")]
    public int LectureStartWeek { get; set; } = 0;

    [Description("Tuần bắt đầu học thực hành (1, 2, 3, ...)")]
    public int LabStartWeek { get; set; } = 1;

    [Description("Giai đoạn học")] public SubjectTimelineStage Stage { get; set; } = SubjectTimelineStage.Stage1;
    
    
    public List<string> LectureRequiredConditions { get; set; } = [];
    public List<string> LabRequiredConditions { get; set; } = [];

    
}