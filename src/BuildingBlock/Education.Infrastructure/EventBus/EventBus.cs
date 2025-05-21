using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;

namespace Education.Infrastructure.EventBus;

public class EventBus(IServiceProvider serviceProvider, ILogger<EventBus> logger) : IEventBus
{

    public async Task Publish(ICollection<IDomainEvent> events, CancellationToken cancellation)
    {
        using var scope = serviceProvider.CreateScope();
        foreach (var domainEvent in events)
        {
            var producerType = typeof(ITopicProducer<>).MakeGenericType(domainEvent.GetType());
            var producer = (dynamic)scope.ServiceProvider.GetService(producerType);
            if (producer is null)
            {
                logger.LogWarning("No producer found for domain event: {EventName}", domainEvent.GetType().Name);
            }
            if (producer != null) await producer.Produce((dynamic)domainEvent, cancellation);
            logger.LogInformation("Domain event published: {EventName}", domainEvent.GetType().Name);
        }
    }
}