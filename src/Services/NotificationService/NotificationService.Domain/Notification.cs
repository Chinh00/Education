using Education.Core.Domain;

namespace NotificationService.Domain;

public class Notification : BaseEntity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
    public List<string> Roles { get; set; }
}