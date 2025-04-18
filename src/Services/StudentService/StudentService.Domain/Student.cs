using Education.Core.Domain;

namespace StudentService.Domain;

public class Student : BaseEntity
{
    public PersonalInformation PersonalInformation { get; set; }
    public InformationBySchool InformationBySchool { get; set; }
    public List<EducationProgram> TrainingPrograms { get; set; }
    public List<HistorySemester> HistorySemesters { get; set; }
}