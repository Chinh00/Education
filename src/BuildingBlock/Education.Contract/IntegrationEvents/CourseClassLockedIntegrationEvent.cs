using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record CourseClassLockedIntegrationEvent(List<CourseClassLockedModel> ClassLockedModels): IIntegrationEvent
{
    
}
public record CourseClassLockedModel(string CourseClassCode, List<string> Students);