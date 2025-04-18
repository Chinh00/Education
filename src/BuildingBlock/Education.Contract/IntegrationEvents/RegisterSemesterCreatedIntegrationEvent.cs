using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class RegisterSemesterCreatedIntegrationEvent : IIntegrationEvent
{
    public string CourseName { get; set; }
    public string CourseCode { get; set; }
    public string EducationCode { get; set; }
    public string EducationName { get; set; }
    public string SemesterCode { get; set; }
    public string SemesterName { get; set; }
    public ICollection<RegisterSubject> Subjects { get; set; }
}

public record RegisterSubject (string SubjectCode, string SubjectName);