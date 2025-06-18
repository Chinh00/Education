using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Infrastructure;
using Education.Infrastructure.Elk;
using Education.Infrastructure.Mongodb;
using MassTransit;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Nest;
using TrainingService.AppCore.StateMachine;
using TrainingService.Infrastructure.RoomIndexer;

namespace TrainingService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddElasticSearchService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        var elasticSearchOptions = new ElasticOptions();
        configuration.GetSection(ElasticOptions.Name).Bind(elasticSearchOptions);

        services.AddSingleton<IElasticClient>(new ElasticClient(new ConnectionSettings(new Uri(elasticSearchOptions.ConnectionString)).DisablePing()
            .SniffOnStartup(false)
            .SniffOnConnectionFault(false)));
        services.AddScoped<IElasticManager, ElasticManager>();
        services.AddScoped<IRoomIndexManager, RoomIndexManager>();
        services.AddHostedService<RoomIndexInitializerHostedService>();
        
        
        action?.Invoke(services);
        return services;
    }
    public static IServiceCollection AddMasstransitService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddHttpClient();
        services.AddApplicationService();
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
        services.AddMassTransit(c =>
        {
            var mOption = new MongoOptions();
            configuration.GetSection(MongoOptions.Name).Bind(mOption);
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<StartRegisterPipelineIntegrationEvent>(nameof(StartRegisterPipelineIntegrationEvent));
                e.AddProducer<WishListCreatedIntegrationEvent>(nameof(WishListCreatedIntegrationEvent));
                e.AddProducer<WishListLockedIntegrationEvent>(nameof(WishListLockedIntegrationEvent));
                e.AddProducer<StartRegisterNotificationIntegrationEvent>(nameof(StartRegisterNotificationIntegrationEvent));
                e.AddProducer<StudentRegistrationStartedIntegrationEvent>(nameof(StudentRegistrationStartedIntegrationEvent));
                e.AddProducer<CourseClassesCreatedIntegrationEvent>(nameof(CourseClassesCreatedIntegrationEvent));
                e.AddProducer<SemesterCreatedNotificationIntegrationEvent>(nameof(SemesterCreatedNotificationIntegrationEvent));
                e.AddProducer<InitDepartmentAdminAccountIntegrationEvent>(nameof(InitDepartmentAdminAccountIntegrationEvent));
                
                
               

                e.AddConsumer<EventDispatcher>();
                e.AddSagaStateMachine<RegisterStateMachine, RegisterState, RegisterStateMachineDefinition>()
                    .MongoDbRepository(t =>
                    {
                        t.Connection = mOption.ToString();
                        t.DatabaseName = mOption.Database;
                        t.CollectionName = "Register";
                    });
                
                
                e.UsingKafka((context, configurator) =>
                {
                    configurator.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    configurator.TopicEndpoint<StartRegisterPipelineIntegrationEvent>(nameof(StartRegisterPipelineIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureSaga<RegisterState>(context);
                        });
                    
                    
                    
                    
                    
                    configurator.TopicEndpoint<WishListCreatedIntegrationEvent>(nameof(WishListCreatedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureSaga<RegisterState>(context);
                        });
                    configurator.TopicEndpoint<WishListLockedIntegrationEvent>(nameof(WishListLockedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureSaga<RegisterState>(context);
                        });
                    configurator.TopicEndpoint<StudentRegistrationStartedIntegrationEvent>(
                        nameof(StudentRegistrationStartedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureSaga<RegisterState>(context);
                        });
                    
                     
                     
                     configurator.TopicEndpoint<RegisterLockedIntegrationEvent>(nameof(RegisterLockedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                     configurator.TopicEndpoint<CourseClassLockedIntegrationEvent>(nameof(CourseClassLockedIntegrationEvent), "training-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                     
                });
            });
        });
        services.AddHostedService<SeedDataHostedService>();
        
        action?.Invoke(services);
        return services;
    }
}