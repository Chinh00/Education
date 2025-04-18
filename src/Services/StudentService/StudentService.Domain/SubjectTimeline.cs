using System.ComponentModel;

namespace StudentService.Domain;
[Description("Thời khoá biểu của môn học")]
public class SubjectTimeline
{
    public DateTime SubjectStartDate { get; set; }
    public DateTime SubjectEndDate { get; set; }
}