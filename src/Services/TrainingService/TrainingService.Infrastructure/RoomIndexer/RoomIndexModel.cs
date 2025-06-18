using Education.Core.Repository;

namespace TrainingService.Infrastructure.RoomIndexer;

public class RoomIndexModel : ElasticEntity<string>
{
    public int Capacity { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public string BuildingCode { get; set; }
    public ICollection<string> SupportedConditions { get; set; }
}