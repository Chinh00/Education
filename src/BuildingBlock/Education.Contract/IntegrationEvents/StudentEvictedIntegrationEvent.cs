using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record StudentEvictedIntegrationEvent(string SemesterCode, string StudentCode, string CourseClassCode) : IIntegrationEvent
{
    
}