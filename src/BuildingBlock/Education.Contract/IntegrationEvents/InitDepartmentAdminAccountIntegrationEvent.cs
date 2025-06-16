using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record InitDepartmentAdminAccountIntegrationEvent(string departmentCode, string departmentName) : IIntegrationEvent
{
    
}