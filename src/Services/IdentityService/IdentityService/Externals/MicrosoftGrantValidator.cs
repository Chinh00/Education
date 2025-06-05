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
    
    public async Task ValidateAsync(ExtensionGrantValidationContext context)
    {
        var idToken = context.Request.Raw["id_token"];
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
            Console.WriteLine(string.Join(",", handler.ReadJwtToken(idToken).Claims.Select( c => c.Type)));
            var email = handler.ReadJwtToken(idToken).Claims.First(c => c.Type == "email").Value;
            var studentCode = email.Split("@").First();
            
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

            context.Result = new GrantValidationResult(
                subject: user?.Id,
                authenticationMethod: GrantType,
                claims: []);
        }
        catch (Exception ex)
        {
            context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, ex.Message);
        }
        
        
        
        


        
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

