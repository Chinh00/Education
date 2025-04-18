using System.Text.Json.Serialization;
using Education.Core.Utils;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Education.Core.Domain;

public class BaseEntity
{
    [JsonConverter(typeof(ObjectIdJsonConverter))]
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
    public DateTime CreatedAt { get; set; } = DateTimeUtils.GetUtcTime();
    public DateTime? UpdatedAt { get; set; }
}