using Education.Core.Domain;

namespace TrainingService.Domain;

public class Building : BaseEntity
{
    public string BuildingCode { get; set; }

    public byte[] Location { get; set; }

    public string Name { get; set; }
    
    public string TrainingBaseCode { get; set; }
}