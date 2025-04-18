using System.ComponentModel;

namespace StudentService.Domain;

[Description("Các môn học đăng ký trong 1 kì")]
public class RegisterSubject
{
    public DateTime RegisterStartDate { get; set; }
    public DateTime RegisterEndDate { get; set; }
    public DateTime AdditionalStartDate { get; set; }
    public DateTime AdditionalEndDate { get; set; }
    
    public List<SubjectDetail> SubjectDetails { get; set; }
    
}