using System.ComponentModel;
using StudentService.Domain.Enums;

namespace StudentService.Domain;

public class SubjectResult
{
    public string SubjectName { get; set; }
    public double? Coeffiecient { get; set; }

    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    public int NumberOfCredits { get; set; }
    [Description("Điểm hệ số 10")]
    public decimal Mark { get; set; }
    public decimal OriginalMark { get; set; }
    public int ExamRound { get; set; }
    

    public string Description { get; set; }
    [Description("Loại điểm ")]
    public SubjectMarkType SubjectMarkType { get; set; }
    [Description("Điểm chữ")]
    public string MarkTypeChar { get; set; }
    public int? Result { get; set; }
}