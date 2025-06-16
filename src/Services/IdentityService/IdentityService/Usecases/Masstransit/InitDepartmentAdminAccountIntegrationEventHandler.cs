using Education.Contract.IntegrationEvents;
using IdentityService.Models;
using IdentityService.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Usecases.Masstransit;

public class InitDepartmentAdminAccountIntegrationEventHandler(UserManager userManager)
    : INotificationHandler<InitDepartmentAdminAccountIntegrationEvent>
{
    public async Task Handle(InitDepartmentAdminAccountIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var department = await userManager.FindByNameAsync(notification.departmentCode);
        if (department is not null) return;
        var result = await userManager.CreateAsync(new ApplicationUser()
        {
            UserName = notification.departmentCode,
            FullName = notification.departmentName,
            Email = $"{notification.departmentCode}@e.tlu.edu.vn",
        }, notification.departmentCode);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(await userManager.FindByNameAsync(notification.departmentCode) ?? throw new InvalidOperationException(), "department-admin");
        }
    }
}