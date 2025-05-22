using Education.Contract.IntegrationEvents;
using Education.Core.Domain;

namespace StudentService.Domain;

public class Student : AggregateBase
{
    public PersonalInformation PersonalInformation { get; set; }
    public InformationBySchool InformationBySchool { get; set; }
    public List<StudentEducationProgram> EducationPrograms { get; set; }

    public void CreateStudent(StudentDetail studentDetail)
    {
        PersonalInformation = new PersonalInformation()
        {
            FirstName = studentDetail?.PersonalInformation?.FirstName,
            LastName = studentDetail?.PersonalInformation?.LastName,
            FullName = studentDetail?.PersonalInformation?.FullName,
            BirthDate = studentDetail?.PersonalInformation?.BirthDate ?? DateTime.MinValue,
            Gender = (PersonGender)(studentDetail?.PersonalInformation?.Gender ?? 0),
            PlaceOfBirth = studentDetail?.PersonalInformation?.PlaceOfBirth,
            ContactAddress = studentDetail?.PersonalInformation?.ContactAddress,
            IdNumber = studentDetail?.PersonalInformation?.IdNumber,
            Note = studentDetail?.PersonalInformation?.Note,
            PhoneNumber = studentDetail?.PersonalInformation?.PhoneNumber,
            Email = studentDetail?.PersonalInformation?.Email,
            OfficeEmail = studentDetail?.PersonalInformation?.OfficeEmail,
            CurrentLive = studentDetail?.PersonalInformation?.CurrentLive,
            Ethnic = studentDetail?.PersonalInformation?.Ethnic
        };
        InformationBySchool = new InformationBySchool()
        {
            StudentCode = studentDetail?.InformationBySchool?.StudentCode,
            
        };
    }
    
}