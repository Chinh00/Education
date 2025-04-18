using System.ComponentModel;

namespace StudentService.Domain;

public class SubjectResult
{
    public string SubjectName { get; set; }
    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    public int NumberOfCredits { get; set; }
    [Description("Điểm hệ số 10")]
    public decimal Mark { get; set; }
    [Description("Điểm hệ số 4")]
    public decimal MarkFour { get; set; }

    public string Description { get; set; }
    [Description("Loại điểm ")]
    public SubjectMarkType SubjectMarkType { get; set; }
    [Description("Điểm chữ")]
    public string MarkTypeChar { get; set; }
    public int? Result { get; set; }
}