using Confluent.Kafka;
using Education.Contract;
using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Infrastructure;
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
        services.AddHttpClient();
        services.AddHostedService<SeedDataHostedService>();
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
                e.AddProducer<CourseClassCreatedIntegrationEvent>(nameof(CourseClassCreatedIntegrationEvent));
                
                
                e.AddProducer<CourseClassCreatedDomainEvent>(nameof(CourseClassCreatedDomainEvent));
                e.AddProducer<SlotTimelineCreatedDomainEvent>(nameof(SlotTimelineCreatedDomainEvent));
                e.AddProducer<CourseClassAssignedTeacherDomainEvent>(nameof(CourseClassAssignedTeacherDomainEvent));
                
                
                
                e.AddProducer<SemesterCreatedDomainEvent>(nameof(SemesterCreatedDomainEvent));
                e.AddProducer<SemesterStatusChangedDomainEvent>(nameof(SemesterStatusChangedDomainEvent));
                e.AddProducer<RegisterConfigCreatedDomainEvent>(nameof(RegisterConfigCreatedDomainEvent));

                e.AddConsumer<EventDispatcher>();
                e.AddSagaStateMachine<RegisterStateMachine, RegisterState, RegisterStateMachineDefinition>()
                    .MongoDbRepository(t =>
                    {
                        t.Connection = mOption.ToString();
                        t.DatabaseName = mOption.Database;
                        t.CollectionName = "RegisterSaga";
                    });
                e.AddSagaStateMachine<SubjectStateMachine, SubjectState, SubjectStateMachineDefinition>()
                    .MongoDbRepository(t =>
                    {
                        t.Connection = mOption.ToString();
                        t.DatabaseName = mOption.Database;
                        t.CollectionName = "SubjectSaga";
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
                     
                     
                     configurator.TopicEndpoint<RegisterLockedIntegrationEvent>(nameof(RegisterLockedIntegrationEvent), "training-register",
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
                     configurator.TopicEndpoint<RegisterConfigCreatedDomainEvent>(nameof(RegisterConfigCreatedDomainEvent), "generate-register",
                         endpointConfigurator =>
                         {
                             endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                             endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                             endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                         });
                     configurator.TopicEndpoint<CourseClassCreatedDomainEvent>(nameof(CourseClassCreatedDomainEvent), "generate-register",
                         endpointConfigurator =>
                         {
                             endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                             endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                             endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                         });
                     configurator.TopicEndpoint<SlotTimelineCreatedDomainEvent>(nameof(SlotTimelineCreatedDomainEvent), "generate-register",
                         endpointConfigurator =>
                         {
                             endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                             endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                             endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                         });
                     
                    
                    configurator.TopicEndpoint<CourseClassAssignedTeacherDomainEvent>(nameof(CourseClassAssignedTeacherDomainEvent), "generate-register",
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