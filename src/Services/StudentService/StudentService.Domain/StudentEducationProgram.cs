using System.ComponentModel;
using StudentService.Domain.Enums;

namespace StudentService.Domain;

public class StudentEducationProgram
{
    public string Code { get; set; }
    public string Name { get; set; }
    public int Type { get; set; }
    public float TrainingTime { get; set; }
    [Description("Lớp quản lý")]
    public string StudentClassName { get; set; }
    public string StudentClassCode { get; set; }
    [Description("Khoá ")]
    public int CourseYear { get; set; }
    [Description("Khoa")]
    public string DepartmentName { get; set; }
    public string DepartmentCode { get; set; }
    [Description("Ngành")]
    public string SpecialityName { get; set; }
    [Description("Ngành")]
    public string SpecialityCode { get; set; }
    [Description("Trạng thái chương trình học")]
    public EducationProgramStatus Status { get; set; } = EducationProgramStatus.Active;
}