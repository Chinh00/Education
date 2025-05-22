using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Test;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile()
        {
            UserClaims = { "isConfirm", "role" },
        },
    ];

    public static IEnumerable<ApiScope> ApiScopes =>
        [
            new ApiScope("api.student", "Student api"),
            new ApiScope("api.admin", "Admin api")
        ];

    public static IEnumerable<Client> Clients =>
        [
            new Client
            {
                ClientId = "microsoft",
                AllowedGrantTypes = new List<string> { "external" },
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedScopes =  { "openid", "profile", "api" },
                AlwaysIncludeUserClaimsInIdToken = true, 
            },
            new Client
            {
                ClientId = "daotao",
                AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedScopes =  { "openid", "profile", "api.admin", "role" },
                AlwaysIncludeUserClaimsInIdToken = true, 
            },
            new Client
            {
                ClientId = "sinhvientest",
                AllowedGrantTypes = {"external_student"},
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedScopes =  { "openid", "profile", "api.student", "role" },
                AlwaysIncludeUserClaimsInIdToken = true, 
            },
        ];
}