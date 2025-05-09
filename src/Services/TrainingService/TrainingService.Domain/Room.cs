using Education.Core.Domain;

namespace TrainingService.Domain;

public class Room : BaseEntity
{
    public int? Capacity { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public int? ExamCapacity { get; set; }

    public string BuildingCode { get; set; }
}