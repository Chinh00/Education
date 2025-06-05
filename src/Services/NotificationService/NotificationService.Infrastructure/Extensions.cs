using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using MassTransit;

namespace NotificationService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddMasstransitService(this IServiceCollection services,
        IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddConsumer<EventDispatcher>();
                e.UsingKafka((context, configurator) =>
                {
                    configurator.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    configurator.TopicEndpoint<StartRegisterNotificationIntegrationEvent>(
                        nameof(StartRegisterNotificationIntegrationEvent), "notification-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    configurator.TopicEndpoint<RegisterCourseClassSucceedNotificationIntegrationEvent>(
                        nameof(RegisterCourseClassSucceedNotificationIntegrationEvent), "notification-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    configurator.TopicEndpoint<SemesterCreatedNotificationIntegrationEvent>(
                        nameof(SemesterCreatedNotificationIntegrationEvent), "notification-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    
                    
                });
            });
        });


        return services;
    }
}