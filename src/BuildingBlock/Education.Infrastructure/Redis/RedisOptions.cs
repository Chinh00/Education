namespace Education.Infrastructure.Redis;

public class RedisOptions
{
    public static string SectionName = "Redis";
    public string Url { get; set; } = "localhost:6379";
    public string Password { get; set; } = "";

    public string GetConnectionString()
    {
        return string.IsNullOrEmpty(Password) ? Url : $"{Url},password={Password},abortConnect=False";
    }
}