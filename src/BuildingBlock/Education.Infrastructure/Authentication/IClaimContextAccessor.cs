namespace Education.Infrastructure.Authentication;

public interface IClaimContextAccessor
{
    string GetUserId();

    Guid GetUserMail();
    string GetAvatar();
    string GetUsername();
    string GetName();
}