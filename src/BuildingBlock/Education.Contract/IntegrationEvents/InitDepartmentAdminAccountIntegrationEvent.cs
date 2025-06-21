using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record InitDepartmentAdminAccountIntegrationEvent(string DepartmentCode, string DepartmentName, string Path) : IIntegrationEvent
{
    
}