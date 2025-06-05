
using Education.Core.Domain;
using StudentService.Domain.Enums;

namespace StudentService.Domain;

public class Student : BaseEntity
{
    public StudentStatus Status { get; set; } = StudentStatus.NoData;
    public PersonalInformation PersonalInformation { get; set; }
    public InformationBySchool InformationBySchool { get; set; }
    public List<StudentEducationProgram> EducationPrograms { get; set; }
}