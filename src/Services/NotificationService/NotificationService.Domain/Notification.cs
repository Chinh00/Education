using Education.Core.Domain;

namespace NotificationService.Domain;

public class Notification : BaseEntity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public List<string> Roles { get; set; }

    /// <summary>
    /// Trống thì broadcast cho tất cả người dùng
    /// </summary>
    public List<string> Recipients { get; set; } = [];
}