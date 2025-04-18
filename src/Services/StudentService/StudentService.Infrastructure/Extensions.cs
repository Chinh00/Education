using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using MassTransit;

namespace StudentService.Infrastructure;

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
                e.AddProducer<StudentCreatedIntegrationEvent>(nameof(StudentCreatedIntegrationEvent));
                
                e.UsingKafka((context, config) =>
                {
                    config.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    config.TopicEndpoint<StudentCreatedIntegrationEvent>(nameof(StudentCreatedIntegrationEvent), "student-identity",
                        configurator =>
                        {
                            configurator.CreateIfMissing(n => n.NumPartitions = 1);
                            configurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                        });
                });
            });
        });
        action?.Invoke(services);
        return services;
    }
}