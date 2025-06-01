using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models;

public class ApplicationUser : IdentityUser
{
    public bool IsConfirm { get; set; }
    public string FullName { get; set; }
}