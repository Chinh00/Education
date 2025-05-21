using IdentityService.Data;
using IdentityService.Models;
using IdentityService.Services;
using Microsoft.AspNetCore.Identity;

namespace IdentityService;

public class SeedDataHostedService(IServiceScopeFactory scopeFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var scope = scopeFactory.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
        ArgumentNullException.ThrowIfNull(roleManager);
        await roleManager.CreateAsync(new IdentityRole("student"));
        await roleManager.CreateAsync(new IdentityRole("admin"));
        await roleManager.CreateAsync(new IdentityRole("department-admin"));
        await roleManager.CreateAsync(new IdentityRole("teacher"));
        
        var admin = await userManager.FindByNameAsync("admin");
        if (admin is null)
        {
            var result = await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = "admin",
                Email = "admin@example.com",
                
            }, "admin");
        }
        
        var nv1 = await userManager.FindByNameAsync("nv1");
        if (nv1 is null)
        {
            var result = await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = "nv1",
                Email = "nv1@example.com",
                
            }, "nv1");
        }
        var nv2 = await userManager.FindByNameAsync("nv2");
        if (nv2 is null)
        {
            var result = await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = "nv2",
                Email = "nv2@example.com",
                
            }, "nv2");
        }


        if (admin != null) await userManager.AddToRoleAsync(admin, "admin");
        if (nv1 != null) await userManager.AddToRoleAsync(nv1, "admin");
        if (nv2 != null) await userManager.AddToRoleAsync(nv2, "admin");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}