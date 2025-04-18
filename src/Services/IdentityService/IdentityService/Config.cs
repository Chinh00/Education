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
                AllowedScopes =  { "openid", "profile", "api.admin" },
                AlwaysIncludeUserClaimsInIdToken = true, 
            },
            new Client
            {
                ClientId = "sinhvientest",
                AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedScopes =  { "openid", "profile", "api.student" },
                AlwaysIncludeUserClaimsInIdToken = true, 
            },
        ];

    public static List<TestUser> TestUsers =>
    [
        new()
        {
           SubjectId = "1", 
           Username = "admin",
           Password = "Pass1234$",
        },
        new()
        {
            SubjectId = "2151062726", 
            Username = "2151062726",
            Password = "2151062726",
            Claims = new List<Claim>()
            {
                new Claim("studentCode", "2151062726")
            }
        }
    ];
}