using System.Security.Claims;
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
        var department = await userManager.FindByNameAsync(notification.DepartmentCode);
        if (department is not null) return;
        var result = await userManager.CreateAsync(new ApplicationUser()
        {
            UserName = notification.DepartmentCode,
            FullName = notification.DepartmentName,
            Email = $"{notification.DepartmentCode}@e.tlu.edu.vn",
        }, notification.DepartmentCode);
        await userManager.AddClaimAsync(
            await userManager.FindByNameAsync(notification.DepartmentCode) ?? throw new InvalidOperationException(),
            new Claim("department-path", notification.Path));
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(await userManager.FindByNameAsync(notification.DepartmentCode) ?? throw new InvalidOperationException(), "department-admin");
        }
    }
}