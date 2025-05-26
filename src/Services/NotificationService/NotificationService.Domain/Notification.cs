using Education.Core.Domain;

namespace NotificationService.Domain;

public class Notification : BaseEntity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Type { get; set; }
    public bool IsRead { get; set; }
}