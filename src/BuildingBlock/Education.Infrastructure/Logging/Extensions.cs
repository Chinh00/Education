using Serilog;

namespace Education.Infrastructure.Logging;

public static class Extensions
{
    public static IServiceCollection AddLoggingService(this IServiceCollection services,
        Action<IServiceCollection> action = null)
    {
        var logger = new LoggerConfiguration().Enrich.FromLogContext().WriteTo.Console().CreateLogger();    
        
        Log.Logger = logger;
        services.AddSerilog();
        action?.Invoke(services);
        return services;
    }
}