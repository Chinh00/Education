using System.ComponentModel;

namespace StudentService.Domain;

public class HistorySemester
{
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    
    [Description("Thời gian bắt đầu kì học")]
    public DateTime EducationStartDate { get; set; }
    
    [Description("Thời gian kết thúc kì học")]
    public DateTime EducationEndDate { get; set; }
    
    [Description("Thời gian kết thúc kì học")]
    public DateTime StartDate { get; set; }
    [Description("Thời gian kết thúc kì học")]
    public DateTime EndDate { get; set; }
    [Description("Lịch sử học")]

    public ICollection<SubjectResult> SubjectResults { get; set; }
}