using Education.Core.Repository;

namespace Education.Infrastructure.Mongodb;

public static class Extensions
{
    public static IServiceCollection AddMongodbService(this IServiceCollection services, IConfiguration configuration, Type mongodbType,
        Action<IServiceCollection> action = null)
    {
        services.Configure<MongoOptions>(configuration.GetSection(MongoOptions.Name));
        services.Scan(c => c.FromAssembliesOf(mongodbType)
            .AddClasses(e => e.AssignableTo(typeof(IMongoRepository<>))).AsImplementedInterfaces()
            .WithTransientLifetime()
        );
        
        action?.Invoke(services);
        return services;
    }
}