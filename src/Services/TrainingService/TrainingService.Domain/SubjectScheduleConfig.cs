using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class SubjectScheduleConfig : BaseEntity
{
    public string SubjectCode { get; set; }
    // tong so lop ly thuyet cua mon hoc
    public int TotalTheoryCourseClass { get; set; }
    // tong so lop thuc hanh cua mon hoc
    public int TotalPracticeCourseClass { get; set; }
    // Giai doan 1, giai doan 2,  giai doan 1 cua 2 giai doan, giai doan 2 cua 2 giai doan
    public SubjectTimelineStage Stage { get; set; }
    // Tong so tiet ly thuyet cua mon hoc
    public int TheoryTotalPeriod { get; set; } 
    // Tong so tiet thuc hanh cua mon hoc
    public int PracticeTotalPeriod { get; set; }
    // So buoi ly thuyet trong 1 tuan VD [3, 2, 3] => 3 buoi, buoi 1 co 3 tiet, buoi 2 co 2 tiet, buoi 3 co 3 tiet
    public int[] TheorySessions { get; set; } = [];
    // So buoi thuc hanh trong 1 tuan VD [3, 3] => 2 buoi, moi buoi 3 tiet 
    public int[] PracticeSessions { get; set; } = [];
    // tuan bat dau cua mon hoc trong hoc ky
    public int WeekStart { get; set; } = 0;
}