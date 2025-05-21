using MongoDB.Bson;
using Newtonsoft.Json;

namespace Education.Core.Utils;

public class ObjectIdJsonNewtonsoftConverter : JsonConverter<ObjectId>
{
    public override void WriteJson(JsonWriter writer, ObjectId value, JsonSerializer serializer)
    {
        writer.WriteValue(value.ToString());
    }

    public override ObjectId ReadJson(JsonReader reader, Type objectType, ObjectId existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        var value = reader.Value?.ToString();
        return string.IsNullOrEmpty(value) ? ObjectId.Empty : ObjectId.Parse(value);
    }
}