using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Dữ được đồng bộ từ hệ thống DTS")]
public record StudentPulledDomainEvent(string AggregateId, StudentEvent Student) : DomainEventBase
{
    
}



public class StudentEvent
{
    public PersonalInformationEvent PersonalInformation { get; set; }
    public InformationBySchoolEvent InformationBySchool { get; set; }
    public List<EducationProgramEvent> EducationPrograms { get; set; }
}

public class PersonalInformationEvent
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }    
    public DateTime BirthDate { get; set; }    
    public int Gender { get; set; }
    public string PlaceOfBirth { get; set; }
    public string ContactAddress { get; set; }
    public string IdNumber { get; set; }
    public string Note { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string OfficeEmail { get; set; }
    public string CurrentLive { get; set; }
    public string Ethnic { get; set; }
}

public class InformationBySchoolEvent
{
    public string StudentCode { get; set; }
    public string BankCode { get; set; }
    public string BankName { get; set; }
    public int YearOfHighSchoolGraduation { get; set; }
}

public class EducationProgramEvent
{
    public string Code { get; set; }
    public string Name { get; set; }
    public int Type { get; set; }
    public float TrainingTime { get; set; }
    public string StudentClassName { get; set; }
    public string StudentClassCode { get; set; }
    public int CourseYear { get; set; }
    public string DepartmentName { get; set; }
    public string DepartmentCode { get; set; }
    public string SpecialityName { get; set; }
    public string SpecialityCode { get; set; }
    public int Status { get; set; }
}

