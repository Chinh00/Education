using Education.Core.Domain;

namespace TrainingService.Domain;

public class Speciality : BaseEntity
{
    public string DepartmentCode { get; set; }
    public string SpecialityCode { get; set; }
    public string SpecialityName { get; set; }
    public string SpecialityNameEng { get; set; }
    public string SpecialityParentCode { get; set; }
}