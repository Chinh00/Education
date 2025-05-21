using Confluent.Kafka;
using Education.Contract;
using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Application;
using Education.Infrastructure.EventBus;
using Education.Infrastructure.EventStore;
using Education.Infrastructure.Mongodb;
using MassTransit;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.SubjectSaga;

namespace TrainingService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddMasstransitService(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddScoped<IEventBus, EventBus>();
        services.AddScoped(typeof(IEventStoreRepository<>), typeof(EventStoreRepositoryBase<>));
        services.AddScoped(typeof(IApplicationService<>), typeof(ApplicationServiceBase<>));
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
        services.AddMassTransit(c =>
        {
            var mOption = new MongoOptions();
            configuration.GetSection(MongoOptions.Name).Bind(mOption);
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<WishListCreatedIntegrationEvent>(nameof(WishListCreatedIntegrationEvent));
                e.AddProducer<WishListCreated>(nameof(WishListCreated));
                e.AddProducer<GenerateScheduleCreated>(nameof(GenerateScheduleCreated));
                e.AddProducer<GenerateScheduleSuccess>(nameof(GenerateScheduleSuccess));
                e.AddProducer<GenerateScheduleFail>(nameof(GenerateScheduleFail));
                e.AddProducer<WishListLockedIntegrationEvent>(nameof(WishListLockedIntegrationEvent));
                
                
                
                e.AddProducer<SemesterCreatedDomainEvent>(nameof(SemesterCreatedDomainEvent));
                e.AddProducer<SemesterStatusChangedDomainEvent>(nameof(SemesterStatusChangedDomainEvent));

                e.AddConsumer<EventDispatcher>();
                e.AddSagaStateMachine<RegisterStateMachine, RegisterState, RegisterStateMachineDefinition>()
                    .MongoDbRepository(e =>
                    {
                        e.Connection = mOption.ToString();
                        e.DatabaseName = mOption.Database;
                        e.CollectionName = "RegisterSaga";
                    });
                e.AddSagaStateMachine<SubjectStateMachine, SubjectState, SubjectStateMachineDefinition>()
                    .MongoDbRepository(e =>
                    {
                        e.Connection = mOption.ToString();
                        e.DatabaseName = mOption.Database;
                        e.CollectionName = "SubjectSaga";
                    });
                
                e.UsingKafka((context, configurator) =>
                {
                    configurator.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
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
                     configurator.TopicEndpoint<WishListCreated>(nameof(WishListCreated), "training-register",
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
                     configurator.TopicEndpoint<GenerateScheduleCreated>(nameof(GenerateScheduleCreated), "generate-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                     
                     
                     
                     
                     
                     configurator.TopicEndpoint<SemesterCreatedDomainEvent>(nameof(SemesterCreatedDomainEvent), "generate-register",
                         endpointConfigurator =>
                         {
                             endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                             endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                             endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                         });
                     configurator.TopicEndpoint<SemesterStatusChangedDomainEvent>(nameof(SemesterStatusChangedDomainEvent), "generate-register",
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