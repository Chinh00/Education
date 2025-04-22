using System.ComponentModel;
using MongoDB.Bson;

namespace StudentService.Domain;

public class InformationBySchool
{
    public string StudentCode { get; set; }
    [Description("Lớp quản lý")]
    public string StudentClassName { get; set; }
    public string StudentClassCode { get; set; }
    [Description("Năm bắt đầu học")]
    public int StartYear { get; set; } 
    [Description("Khoá ")]
    public int CourseYear { get; set; }
    [Description("Khoa")]
    public string Department { get; set; }
    [Description("Ngành")]
    public string Branch { get; set; }
    [Description("Mã chương trình đào tạo")]
    public List<string> EducationCodes { get; set; }
}