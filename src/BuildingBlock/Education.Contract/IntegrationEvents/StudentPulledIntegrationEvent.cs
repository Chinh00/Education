using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class StudentPulledIntegrationEvent(StudentDetail student) : IIntegrationEvent
{
    
}
public class StudentDetail
{
    public PersonalInformation PersonalInformation { get; set; }
    public InformationBySchool InformationBySchool { get; set; }
    public List<HistorySemester> HistorySemesters { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class PersonalInformation
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

public class InformationBySchool
{
    public string StudentCode { get; set; }
    public string StudentClassName { get; set; }
    public string StudentClassCode { get; set; }
    public int StartYear { get; set; }
    public int CourseYear { get; set; }
    public string Department { get; set; }
    public string Branch { get; set; }
    public List<string> EducationCodes { get; set; }
}

public class HistorySemester
{
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    public DateTime EducationStartDate { get; set; }
    public DateTime EducationEndDate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<SubjectResult> SubjectResults { get; set; }
}

public class SubjectResult
{
    public string SubjectName { get; set; }
    public string SubjectNameEng { get; set; }
    public string SubjectCode { get; set; }
    public int NumberOfCredits { get; set; }
    public double Mark { get; set; }
    public double MarkFour { get; set; }
    public string Description { get; set; }
    public int SubjectMarkType { get; set; }
    public string MarkTypeChar { get; set; }
    public int Result { get; set; }
}
