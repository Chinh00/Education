using Education.Contract.IntegrationEvents;
using Education.Infrastructure;
using MassTransit;

namespace StudentService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddMasstransitService(this IServiceCollection services,
        IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddApplicationService();
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<StudentPulledIntegrationEvent>(nameof(StudentPulledIntegrationEvent));
                e.AddConsumer<EventDispatcher>();
                e.UsingKafka((context, config) =>
                {
                    config.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    
                    
                    

                });
            });
        });
        action?.Invoke(services);
        return services;
    }
}