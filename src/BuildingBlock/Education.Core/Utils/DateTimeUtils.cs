namespace Education.Core.Utils;

public static class DateTimeUtils
{
    public static DateTime GetUtcTime() => TimeZoneInfo
        .ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
    public static DateTime FormatDate(DateTime dateTime) => TimeZoneInfo
        .ConvertTimeFromUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
    
}