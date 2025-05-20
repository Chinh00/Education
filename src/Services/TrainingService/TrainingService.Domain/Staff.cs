using Education.Core.Domain;

namespace TrainingService.Domain;

public class Staff : BaseEntity
{
    public string FullName { get; set; }
    public string StaffCode { get; set; }
    public string SpecialityCode { get; set; }
}