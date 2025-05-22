using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using StudentService.Domain.Enums;

namespace StudentService.Domain;

public class Student : AggregateBase
{
    public StudentStatus Status { get; set; } = StudentStatus.NoData;
    public PersonalInformation PersonalInformation { get; set; }
    public InformationBySchool InformationBySchool { get; set; }
    public List<StudentEducationProgram> EducationPrograms { get; set; }

    public void ChangeStatus(StudentStatus status)
    {
        Status = status;
    }
    public void CreateStudent(PersonalInformation personalInformation, InformationBySchool informationBySchool,
        List<StudentEducationProgram> educationPrograms, IDictionary<string, object> metadata = null)
    {
        PersonalInformation = personalInformation;
        InformationBySchool = informationBySchool;
        EducationPrograms = educationPrograms;
        AddDomainEvent(version => new StudentPulledDomainEvent(Id.ToString(), new StudentEvent()
        {
            PersonalInformation = new PersonalInformationEvent()
            {
                FirstName = personalInformation?.FirstName,
                LastName = personalInformation?.LastName,
                FullName = personalInformation?.FullName,
                BirthDate = personalInformation.BirthDate,
                Gender = (int)personalInformation.Gender,
                PlaceOfBirth = personalInformation.PlaceOfBirth,
                ContactAddress = personalInformation.ContactAddress,
                IdNumber = personalInformation.IdNumber,
                Email = personalInformation.Email,
                PhoneNumber = personalInformation.PhoneNumber,
                OfficeEmail = personalInformation.OfficeEmail,
                CurrentLive = personalInformation.CurrentLive,
                Ethnic = personalInformation.Ethnic,
            },
            InformationBySchool = new InformationBySchoolEvent()
            {
                StudentCode = informationBySchool?.StudentCode,
                BankCode = informationBySchool?.BankCode,
                BankName = informationBySchool?.BankName,
                YearOfHighSchoolGraduation = informationBySchool.YearOfHighSchoolGraduation,
            },
            EducationPrograms = educationPrograms.Select(x => new EducationProgramEvent()
            {
                Code = x.Code,
                Name = x.Name,
                Type = x.Type,
                TrainingTime = x.TrainingTime,
                StudentClassName = x.StudentClassName,
                StudentClassCode = x.StudentClassCode,
                CourseYear = x.CourseYear,
                DepartmentName = x.DepartmentName,
                SpecialityName = x.SpecialityName,
                SpecialityCode = x.SpecialityCode,
                Status = (int)x.Status,
            }).ToList()
        })
        {
            Version = version,
            MetaData = metadata
        });
    }
    
}