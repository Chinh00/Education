using Education.Core.Domain;

namespace TrainingService.Domain;

public class Staff : BaseEntity
{
    public string FullName { get; set; }
    public string Code { get; set; }
    public string DepartmentCode { get; set; }
}