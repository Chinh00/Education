namespace Education.Contract.IntegrationEvents;

public class NotificationMessage
{
    public string Title { get; set; }
    public string Content { get; set; }
    public List<string> Roles { get; set; }
}