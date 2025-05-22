using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Duende.IdentityModel.Client;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Validation;
using Microsoft.IdentityModel.Tokens;

namespace IdentityService.Externals;

public class MicrosoftGrantValidator(IHttpClientFactory httpClientFactory, ITokenValidator tokenValidator) : IExtensionGrantValidator
{
    
    public async Task ValidateAsync(ExtensionGrantValidationContext context)
    {
        var provider = context.Request.Raw["provider"];
        var token = context.Request.Raw["token"];

        if (string.IsNullOrWhiteSpace(provider) || string.IsNullOrWhiteSpace(token))
        {
            context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, "Invalid provider or token");
            return;
        }
        var handler = new JwtSecurityTokenHandler();
        var httpClient = new HttpClient();
        var keysUrl = "https://login.microsoftonline.com/bbf9aad6-5f58-4387-927e-02f0b07a72fa/discovery/v2.0/keys";
        var keysJson = await httpClient.GetStringAsync(keysUrl);
        var keys = JsonWebKeySet.Create(keysJson).GetSigningKeys();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://login.microsoftonline.com/bbf9aad6-5f58-4387-927e-02f0b07a72fa/v2.0",
            ValidateAudience = true,
            ValidAudience = "0f7c379c-0685-4e1d-96e3-42c9e3f7381c",
            ValidateLifetime = true,
            IssuerSigningKeys = keys
        };

        try
        {
            handler.ValidateToken(token, validationParameters, out var validatedToken);
            Console.WriteLine(string.Join(",", handler.ReadJwtToken(token).Claims.Select( c => c.Type)));
            Console.WriteLine(handler.ReadJwtToken(token).Claims.First( c => c.Type == "email").Value);
            
            
        }
        catch (Exception ex)
        {
            context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, ex.Message);
        }
        
        
        
        

        var claims = new List<Claim>
        {
            new Claim("idp", provider)
        };

        context.Result = new GrantValidationResult(
            subject: Guid.NewGuid().ToString(),
            authenticationMethod: provider,
            claims: claims);
    }

    public string GrantType => "external";

    

}

public record MicrosoftUserPayload(string? Email, string? Name, string? Picture);
