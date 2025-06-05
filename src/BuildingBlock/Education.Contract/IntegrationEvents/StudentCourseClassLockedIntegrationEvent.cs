using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record StudentCourseClassLockedIntegrationEvent(string StudentCode, string SemesterCode, List<string> CourseClassCodes)
    : IIntegrationEvent
{
    
}

