using Education.Core.Utils;
using MediatR;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Education.Core.Domain;

public class EventStore : BaseEntity, IVersion
{
    public string AggregateType { get; set; }
    [JsonConverter(typeof(ObjectIdJsonNewtonsoftConverter))]
    public ObjectId AggregateId { get; set; }
    public string EventType { get; set; }
    public string EventData { get; set; }
    public IDictionary<string, object> Metadata { get; set; }
    public long Version { get; set; }
}


public class BaseEntity
{
    [JsonConverter(typeof(ObjectIdJsonNewtonsoftConverter))]
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
    public DateTime CreatedAt { get; set; } = DateTimeUtils.GetUtcTime();
    public DateTime? UpdatedAt { get; set; }
}

public interface IVersion
{
    long Version { get; set; }
}

public interface IDomainEvent : IVersion, INotification
{
    IDictionary<string, object> MetaData { get; set; }
}

public record DomainEventBase : IDomainEvent
{
    public long Version { get; set; }
    public IDictionary<string, object> MetaData { get; set; }  = new Dictionary<string, object>();
}


public class AggregateBase : BaseEntity, IVersion
{
    
    [BsonIgnore]
    [JsonIgnore]
    public IList<IDomainEvent> _domainEvents { get; set; }
    [BsonIgnore]
    [JsonIgnore]
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents?.AsReadOnly();

    public void AddDomainEvent(Func<long, IDomainEvent> func)
    {
        _domainEvents ??= new List<IDomainEvent>();
        Version++;
        var domainEvent = func(Version);
        _domainEvents.Add(domainEvent);
    }

    public virtual void ApplyDomainEvent(IDomainEvent @event)
    {
    }

    public void ClearDomainEvents()
    {
        _domainEvents?.Clear();
    }
    public long Version { get; set; } = 0;
}