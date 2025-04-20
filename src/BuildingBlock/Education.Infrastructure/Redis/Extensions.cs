namespace Education.Infrastructure.Redis;

public static class Extensions
{
    public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddOptions<RedisOptions>().Bind(configuration.GetSection(RedisOptions.SectionName));;
        action?.Invoke(services);
        return services;
    }
}