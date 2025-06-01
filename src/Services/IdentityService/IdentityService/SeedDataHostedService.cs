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
        foreach (var departmentModel in Departments)
        {
            var department = await userManager.FindByNameAsync(departmentModel.DepartmentCode);
            if (department is not null) continue;
            var result = await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = departmentModel.DepartmentCode,
                FullName = departmentModel.DepartmentName,
                Email = $"{departmentModel.DepartmentCode}@e.tlu.edu.vn",
            }, departmentModel.DepartmentCode);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(await userManager.FindByNameAsync(departmentModel.DepartmentCode) ?? throw new InvalidOperationException(), "department-admin");
            }
        }
        
        
       
        
        
        
        
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    
    List<DepartmentModel> Departments { get; set; } =
    [
        new("A14.DT03", "Khoa Công nghệ thông tin"),
        new("A14.DT05", "Khoa Cơ khí"),
        new("A14.DT01", "Khoa Công trình"),
        new("A14.DT07", "Khoa Kinh tế và Quản lý"),
        new("A14.DT02", "Khoa Kỹ thuật tài nguyên nước"),
        new("A14.DT08", "Khoa Hóa và Môi trường"),
        new("A14.DT04", "Khoa Điện - Điện tử"),
        new("A14.DT11", "Trung tâm Đào tạo quốc tế"),
        new("A14.ĐT13", "Trung tâm Giáo dục Quốc phòng và An ninh"),
        new("A14.DT10", "Khoa Lý luận chính trị")
    ];
    
    record struct DepartmentModel(string DepartmentCode, string DepartmentName);
}