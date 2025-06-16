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
            await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = "admin",
                Email = "admin@example.com",
                FullName = "Admin Administrator"
                
            }, "admin");
            await userManager.AddToRoleAsync(await userManager.FindByNameAsync("admin") ?? throw new InvalidOperationException(), "admin");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    
    
    
}