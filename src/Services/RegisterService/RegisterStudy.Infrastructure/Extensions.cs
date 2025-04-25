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
            }); 
        
        //     .ConfigurePrimaryHttpMessageHandler(() =>
        // {
        //     var handler = new HttpClientHandler();
        //     var certificate = new X509Certificate2(configuration.GetValue<string>("Cert:Path"), configuration.GetValue<string>("Cert:Password"));
        //
        //     handler.ClientCertificates.Add(certificate);
        //     handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
        //
        //     return handler;
        // })
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
                });
            });
        });
        
        
        action?.Invoke(services);
        return services;
    }
}