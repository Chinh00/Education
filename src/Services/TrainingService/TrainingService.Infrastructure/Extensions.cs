using Confluent.Kafka;
using Education.Contract;
using Education.Contract.IntegrationEvents;
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
                                            
                });
            });
        });
        action?.Invoke(services);
        return services;
    }
}