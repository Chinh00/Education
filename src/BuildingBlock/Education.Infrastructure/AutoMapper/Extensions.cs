namespace Education.Infrastructure.AutoMapper;

public static class Extensions
{
    public static IServiceCollection AddAutoMapperService(this IServiceCollection services, Type type,
        Action<IServiceCollection> action = null)
    {
        services.AddAutoMapper(type);
        action?.Invoke(services);
        return services;
    }
}