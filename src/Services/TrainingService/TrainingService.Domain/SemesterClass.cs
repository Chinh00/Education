using System.Text.Json.Serialization;

using Education.Core.Utils;
using MongoDB.Bson;

namespace TrainingService.Domain;

public class SemesterClass
{
    [JsonConverter(typeof(ObjectIdJsonConverter))]
    public ObjectId SemesterId { get; set; }
    public string SemesterCode { get; set; }
    public ICollection<string> SubjectCodes { get; set; } = [];
}