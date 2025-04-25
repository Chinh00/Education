namespace Education.Infrastructure.Redis;

public static class Extensions
{
    public static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddOptions<RedisOptions>().Bind(configuration.GetSection(RedisOptions.Name));;
        action?.Invoke(services);
        return services;
    }
}