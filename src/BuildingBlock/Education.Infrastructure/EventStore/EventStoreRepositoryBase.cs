using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MassTransit;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Education.Infrastructure.EventStore;

public class EventStoreRepositoryBase<TEntityStore> : IEventStoreRepository<TEntityStore>
    where TEntityStore : Core.Domain.EventStore
{
    private readonly IMongoCollection<TEntityStore> _mongoCollection;

    public EventStoreRepositoryBase(IOptions<MongoOptions> options)
    {
        _mongoCollection = new MongoClient(options.Value.ToString()).GetDatabase(options.Value.Database)
            .GetCollection<TEntityStore>(typeof(TEntityStore).Name);
    }
    public async Task<TEntityStore> SaveAsync(TEntityStore entityStore, CancellationToken cancellationToken)
    {
        await _mongoCollection.InsertOneAsync(entityStore, cancellationToken: cancellationToken);
        return entityStore;
    }

    public async Task<List<TEntityStore>> GetEventStoresFromHistory(ObjectId aggregateId, CancellationToken cancellationToken)
    {
        var result = await _mongoCollection.AsQueryable().Where(c => c.AggregateId == aggregateId)
            .ToListAsync(cancellationToken: cancellationToken);
        return result;
    }
}