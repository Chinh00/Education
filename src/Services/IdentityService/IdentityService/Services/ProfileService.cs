using System.Security.Claims;
using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Services;

public class ProfileService(UserManager userManager) : IProfileService
{
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var userId = context.Subject.GetSubjectId();
        var user = await userManager.FindByIdAsync(userId);
        if (user is not null)
        {
            var claims = new List<Claim>
            {
                new("studentCode", user.UserName ?? ""),
            };
            context.IssuedClaims.AddRange(claims);
        }
        
        
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        context.IsActive = true;
        return Task.CompletedTask;
    }
}