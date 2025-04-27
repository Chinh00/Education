using System.ComponentModel;
using Education.Core.Domain;

namespace TrainingService.Domain;
[Description("Khoa")]
public class Department : BaseEntity
{
    public string DepartmentCode { get; set; }
    public string DepartmentName { get; set; }
}