using System.Text.Json.Serialization;
using Education.Core.Utils;
using MediatR;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Education.Core.Domain;

public class EventStore : BaseEntity, IVersion
{
    public string AggregateType { get; set; }
    [Newtonsoft.Json.JsonConverter(typeof(ObjectIdJsonNewtonsoftConverter))]
    public ObjectId AggregateId { get; set; }
    public string EventType { get; set; }
    public string EventData { get; set; }
    public IDictionary<string, object> Metadata { get; set; }
    public long Version { get; set; }
}


public class BaseEntity
{
    [Newtonsoft.Json.JsonConverter(typeof(ObjectIdJsonNewtonsoftConverter))]
    [JsonIgnore]
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
    [Newtonsoft.Json.JsonIgnore]
    public IList<IDomainEvent> _domainEvents { get; set; }
    [BsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
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