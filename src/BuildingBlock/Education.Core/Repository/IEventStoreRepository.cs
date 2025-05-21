using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Core.Repository;

public interface IEventStoreRepository<TEntityStore> where TEntityStore : EventStore
{
    Task<TEntityStore> SaveAsync(TEntityStore entityStore, CancellationToken cancellationToken);
    Task<List<TEntityStore>> GetEventStoresFromHistory(ObjectId aggregateId, CancellationToken cancellationToken);
    
}