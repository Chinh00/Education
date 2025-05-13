using Education.Core.Domain;
using MassTransit;
using MongoDB.Bson.Serialization.Attributes;

namespace TrainingService.AppCore.StateMachine;

public class RegisterState : SagaStateMachineInstance, ISagaVersion
{
    [BsonId]
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
    public string CurrentState { get; set; } = null!;
    public string SemesterCode { get; set; } = null!;
    public string SemesterName { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
}


