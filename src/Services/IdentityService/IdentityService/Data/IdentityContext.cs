using IdentityService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Data;

public class IdentityContext(DbContextOptions options) : IdentityDbContext<ApplicationUser>(options);