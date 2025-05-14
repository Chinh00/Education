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

        var res = await userManager.AddToRoleAsync(admin, "admin");
            Console.WriteLine(res);
        
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}