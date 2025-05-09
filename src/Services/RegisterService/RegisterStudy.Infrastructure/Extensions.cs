using System.Security.Cryptography.X509Certificates;
using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using GrpcServices;
using MassTransit;

namespace RegisterStudy.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddTrainingGrpcClient(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddGrpcClient<Training.TrainingClient>(
            o =>
            {
                o.Address = new Uri(configuration.GetValue<string>("TrainingGrpc:Url"));
                
            }).ConfigurePrimaryHttpMessageHandler(() =>
        {
            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            return handler;
        });
        
        
        action?.Invoke(services);
        return services;
    }
    
    
    public static IServiceCollection AddMasstransitService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<WishListLockedIntegrationEvent>(nameof(WishListLockedIntegrationEvent));
                e.AddProducer<RegisterLockedIntegrationEvent>(nameof(RegisterLockedIntegrationEvent));
                
                e.AddConsumer<EventDispatcher>();
                e.UsingKafka((context, configurator) =>
                {
                    configurator.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    configurator.TopicEndpoint<RegisterSemesterCreatedIntegrationEvent>(nameof(RegisterSemesterCreatedIntegrationEvent), "register-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    configurator.TopicEndpoint<WishListLockedIntegrationEvent>(nameof(WishListLockedIntegrationEvent), "register-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    configurator.TopicEndpoint<WishListCreatedIntegrationEvent>(nameof(WishListCreatedIntegrationEvent), "register-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    configurator.TopicEndpoint<RegisterLockedIntegrationEvent>(nameof(RegisterLockedIntegrationEvent), "register-training",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    
                });
            });
        });
        
        
        action?.Invoke(services);
        return services;
    }
}