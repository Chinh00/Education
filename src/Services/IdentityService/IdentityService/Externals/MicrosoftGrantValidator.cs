using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Duende.IdentityModel.Client;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Validation;
using IdentityService.Models;
using IdentityService.Services;
using Microsoft.IdentityModel.Tokens;

namespace IdentityService.Externals;

public class MicrosoftGrantValidator(IConfiguration configuration, UserManager userManager, HttpClient httpClient) : IExtensionGrantValidator
{
    private static readonly Dictionary<string, string> departmentAdminCodes = new Dictionary<string, string>
    {
        { "2251162060", "A14.DT0301" },
        
        // Thêm các cặp mã khác theo nhu cầu
    };

    public async Task ValidateAsync(ExtensionGrantValidationContext context)
    {
        var idToken = context.Request.Raw["id_token"];
        var scopesList = context.Request.Raw["scopes[]"];
        
        if (string.IsNullOrWhiteSpace(idToken))
        {
            context.Result = new GrantValidationResult("Id token invalid", "/connect/authorize");
        }



        
        var handler = new JwtSecurityTokenHandler();
        var keysUrl = $"https://login.microsoftonline.com/{configuration.GetValue<string>("Microsoft:TenantId")}/discovery/v2.0/keys";
        var keysJson = await httpClient.GetStringAsync(keysUrl);
        var keys = JsonWebKeySet.Create(keysJson).GetSigningKeys();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://login.microsoftonline.com/{configuration.GetValue<string>("Microsoft:TenantId")}/v2.0",
            ValidateAudience = true,
            ValidAudience = configuration.GetValue<string>("Microsoft:ClientId"),
            ValidateLifetime = true,
            IssuerSigningKeys = keys
        };

        try
        {
            handler.ValidateToken(idToken, validationParameters, out var validatedToken);
            var email = handler.ReadJwtToken(idToken).Claims.First(c => c.Type == "email").Value;
            var studentCode = email.Split("@").First();
            if (studentCode == "2151062726" && scopesList.Contains("api.admin"))
            {
                var user = await userManager.FindByNameAsync("admin");
                context.Result = new GrantValidationResult(
                    subject: user?.Id,
                    authenticationMethod: GrantType,
                    claims: []);
                return;
            }
            if (departmentAdminCodes.TryGetValue(studentCode, out var code))
            {
                var user = await userManager.FindByNameAsync(code);
                if (scopesList != null && scopesList.Contains("api.admin"))
                {
                    context.Result = new GrantValidationResult(
                        subject: user?.Id,
                        authenticationMethod: GrantType,
                        claims: []);
                }
                else
                {
                    context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Unauthorized: required scope missing");
                }
            }
            else
            {
                var user = await userManager.FindByNameAsync(studentCode!);
                if (user is null)
                {
                    var student = await GetStudentDetailAsync(studentCode);
                    await userManager.CreateAsync(new ApplicationUser()
                    {
                        UserName = studentCode,
                        Email = email,
                        IsConfirm = false
                    }, studentCode);
                    user = await userManager.FindByNameAsync(studentCode!);
                }
                await userManager.AddToRoleAsync(await userManager.FindByNameAsync(studentCode!) ?? throw new InvalidOperationException(), "student");

                if (scopesList != null && scopesList.Contains("api.student"))
                {
                    context.Result = new GrantValidationResult(
                        subject: user?.Id,
                        authenticationMethod: GrantType,
                        claims: []);
                }
                else
                {
                    context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Unauthorized: required scope missing");
                }
                
               
            }
            
            
        }
        catch (Exception ex)
        {
            context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, ex.Message);
        }
        context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Unauthorized: required scope missing");
        
        
        
        


        
    }

    public string GrantType => "microsoft";
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

