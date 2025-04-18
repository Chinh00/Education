using System.ComponentModel;

namespace StudentService.Domain;

public enum SubjectMarkType
{
    [Description("Điểm quá trình")]
    A,
    [Description("Điểm thi giữa kì")]
    B,
    [Description("Điểm thi cuối kì")]
    C,
    [Description("Điểm chuyên cần")]
    D,
    [Description("Điểm kiểm tra")]
    E,
    [Description("Điểm tổng kết")]
    F,
}