using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Core.Services;

public interface IApplicationService<TAggregate> where TAggregate : AggregateBase
{
    Task SaveEventStore(TAggregate aggregateBase, CancellationToken cancellationToken);
    Task<TAggregate> ReplayAggregate(ObjectId id, CancellationToken cancellationToken);
}