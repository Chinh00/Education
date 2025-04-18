namespace Education.Infrastructure.Mediator;

public static class Extensions
{
    public static IServiceCollection AddMediatorService(this IServiceCollection services, Type[] types,
        Action<IServiceCollection> action = null)
    {
        services.AddMediatR(c => c.RegisterServicesFromAssemblies(types.Select(t => t.Assembly).ToArray()));
        
        action?.Invoke(services);
        return services;
    }
}