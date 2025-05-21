using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Application;
using Education.Infrastructure.EventStore;

namespace Education.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services,
        Action<IServiceCollection> action = null)
    {
        services.AddScoped<IEventBus, EventBus.EventBus>();
        services.AddScoped(typeof(IEventStoreRepository<>), typeof(EventStoreRepositoryBase<>));
        services.AddScoped(typeof(IApplicationService<>), typeof(ApplicationServiceBase<>));
        action?.Invoke(services);
        return services;
    }
}