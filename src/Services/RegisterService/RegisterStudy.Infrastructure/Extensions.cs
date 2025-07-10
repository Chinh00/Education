using System.Security.Cryptography.X509Certificates;
using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using Education.Infrastructure;
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
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                var certificate = new X509Certificate2(configuration.GetValue<string>("Cert:Path"), configuration.GetValue<string>("Cert:Password"));

                handler.ClientCertificates.Add(certificate);
            }
            
            handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;

            return handler;
        });
        
        
        action?.Invoke(services);
        return services;
    }
    
    
    public static IServiceCollection AddMasstransitService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddApplicationService();
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<RegisterLockedIntegrationEvent>(nameof(RegisterLockedIntegrationEvent));
                e.AddProducer<RegisterCourseClassSucceedNotificationIntegrationEvent>(nameof(RegisterCourseClassSucceedNotificationIntegrationEvent));
                e.AddProducer<CourseClassLockedIntegrationEvent>(nameof(CourseClassLockedIntegrationEvent));
                e.AddProducer<StudentCourseClassLockedIntegrationEvent>(nameof(StudentCourseClassLockedIntegrationEvent));
                
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
                    configurator.TopicEndpoint<CourseClassesCreatedIntegrationEvent>(nameof(CourseClassesCreatedIntegrationEvent), "register-training",
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