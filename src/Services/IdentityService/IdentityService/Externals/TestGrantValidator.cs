using System.Security.Claims;
using System.Text.Json;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Validation;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Externals;

public class TestGrantValidator(UserManager<ApplicationUser> userManager, HttpClient httpClient) : IExtensionGrantValidator
{
    public async Task ValidateAsync(ExtensionGrantValidationContext context)
    {
        var studentCode = context.Request.Raw["student_code"];
        if (string.IsNullOrWhiteSpace(studentCode))
        {
            context.Result = new GrantValidationResult("Invalid student code", "Invalid student code");
        }

        var user = await userManager.FindByNameAsync(studentCode!);
        if (user is null)
        {
            var student = await GetStudentDetailAsync(studentCode);
            await userManager.CreateAsync(new ApplicationUser()
            {
                UserName = studentCode,
                Email = $"{studentCode}@example.com",
                IsConfirm = false
            }, studentCode);
            user = await userManager.FindByNameAsync(studentCode!);
        }

        context.Result = new GrantValidationResult(
            subject: user?.Id,
            authenticationMethod: GrantType,
            claims: []);
    }

    public string GrantType { get; } = "external_student";

    public async Task<object> GetStudentDetailAsync(string studentCode)
    {
        var url = $"https://api5.tlu.edu.vn/api/Student/{studentCode}/detail";
        var response = await httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
            return null;
        var json = await response.Content.ReadAsStringAsync();
    
        var result = JsonSerializer.Deserialize<ResultModelApi<object>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        return result?.Value;
    }
    record ResultModelApi<T>(T Value, bool IsError, string Message);
}