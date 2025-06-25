using Confluent.Kafka;
using Education.Contract.IntegrationEvents;
using Education.Infrastructure;
using MassTransit;

namespace StudentService.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddMasstransitService(this IServiceCollection services,
        IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddApplicationService();
        services.AddMassTransit(c =>
        {
            c.SetKebabCaseEndpointNameFormatter();
            c.UsingInMemory();
            c.AddRider(e =>
            {
                e.AddProducer<StudentPulledIntegrationEvent>(nameof(StudentPulledIntegrationEvent));
                e.AddConsumer<EventDispatcher>();
                e.UsingKafka((context, config) =>
                {
                    config.Host(configuration.GetValue<string>("Kafka:BootstrapServers"));
                    config.TopicEndpoint<StudentCourseClassLockedIntegrationEvent>(nameof(StudentCourseClassLockedIntegrationEvent), "student-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    config.TopicEndpoint<CourseClassAddedStudentIntegrationEvent>(nameof(CourseClassAddedStudentIntegrationEvent), "student-register",
                        endpointConfigurator =>
                        {
                            endpointConfigurator.AutoOffsetReset = AutoOffsetReset.Earliest;
                            endpointConfigurator.CreateIfMissing(t => t.NumPartitions = 1);
                            endpointConfigurator.ConfigureConsumer<EventDispatcher>(context);
                        });
                    config.TopicEndpoint<StudentEvictedIntegrationEvent>(nameof(StudentEvictedIntegrationEvent), "student-register",
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