namespace TrainingService.Domain;

public class Speciality
{
    public string SpecialityCode { get; set; }
    public string SpecialityName { get; set; }
    public string SpecialityNameEng { get; set; }
    public int? SpecialityParentIndex { get; set; }
}