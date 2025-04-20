using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using MassTransit;

namespace TrainingService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddMasstransitService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<RegisterSemesterCreatedIntegrationEvent>(nameof(RegisterSemesterCreatedIntegrationEvent));
                e.UsingKafka((context, configurator) =>
                {
                    configurator.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    configurator.TopicEndpoint<RegisterSemesterCreatedIntegrationEvent>(nameof(RegisterSemesterCreatedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                        });
                });
            });
        });
        action?.Invoke(services);
        return services;
    }
}