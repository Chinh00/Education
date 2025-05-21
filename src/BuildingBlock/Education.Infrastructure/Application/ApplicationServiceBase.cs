using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Core.Utils;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Education.Infrastructure.Application;

public class ApplicationServiceBase<TAggregate>(
    IEventStoreRepository<Core.Domain.EventStore> eventStoreRepositoryBase,
    IEventBus eventBus)
    : IApplicationService<TAggregate>
    where TAggregate : AggregateBase, new()
{

    public async Task SaveEventStore(TAggregate aggregateBase, CancellationToken cancellationToken)
    {
        foreach (var aggregateBaseDomainEvent in aggregateBase.DomainEvents)
        {
            await eventStoreRepositoryBase.SaveAsync(new Core.Domain.EventStore()
            {
                AggregateType = aggregateBase.GetType().Name,
                AggregateId = aggregateBase.Id,
                EventType = aggregateBaseDomainEvent.GetType().AssemblyQualifiedName,
                EventData = JsonConvert.SerializeObject(aggregateBaseDomainEvent),
                Version = aggregateBaseDomainEvent.Version,
                Metadata = aggregateBaseDomainEvent.MetaData
            } , cancellationToken);
        }
        await eventBus.Publish(aggregateBase.DomainEvents.ToList(), cancellationToken);
        aggregateBase.ClearDomainEvents();

    }

    public async Task<TAggregate> ReplayAggregate(ObjectId id, CancellationToken cancellationToken)
    {
        var eventStores = await eventStoreRepositoryBase.GetEventStoresFromHistory(id, cancellationToken);
        var aggregate = new TAggregate();
        
        foreach (var eventStore in eventStores)
        {
            var @event = (IDomainEvent)JsonConvert.DeserializeObject(eventStore.EventData, Type.GetType(eventStore.EventType) ?? throw new InvalidOperationException());
            aggregate.ApplyDomainEvent(@event);
        }
        return aggregate;
    }
}