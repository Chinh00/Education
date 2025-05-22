using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models;

public class ApplicationUser : IdentityUser
{
    public string UserId { get; set; }
    public bool IsConfirm { get; set; }
}