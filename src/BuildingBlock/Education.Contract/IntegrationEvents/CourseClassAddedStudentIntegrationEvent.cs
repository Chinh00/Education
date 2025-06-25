using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record CourseClassAddedStudentIntegrationEvent(string SemesterCode, string StudentCode, string TargetCourseClassCode) : IIntegrationEvent
{
    
}