using System.Security.Claims;

namespace Education.Infrastructure.Authentication;

public class ClaimContextAccessor : IClaimContextAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ClaimContextAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetUserId()
    {

        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
               throw new UnauthorizedAccessException();
    }

    public Guid GetUserMail()
    {
        throw new NotImplementedException();
    }

    public string GetAvatar()
    {
        if (_httpContextAccessor.HttpContext != null) return _httpContextAccessor.HttpContext.User.FindFirst("avatar")?.Value;
        throw new UnauthorizedAccessException();
    }

    public string GetUsername()
    {
        if (_httpContextAccessor.HttpContext != null) return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);
        throw new UnauthorizedAccessException();
    }

    public string GetName()
    {
        if (_httpContextAccessor.HttpContext != null) return _httpContextAccessor.HttpContext.User.FindFirst("studentCode")?.Value;
        throw new UnauthorizedAccessException();
    }

    public string GetRole()
    {
        if (_httpContextAccessor.HttpContext != null) return _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        throw new UnauthorizedAccessException();
    }
}