using System.ComponentModel;
using Education.Core.Domain;
using MassTransit;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TrainingService.AppCore.StateMachine;

public class RegisterState : SagaStateMachineInstance, ISagaVersion
{
    [BsonId]
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
    public string CurrentState { get; set; } = null!;
    public string SemesterCode { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    [Description("Thời gian sinh viên thay đổi")]
    public DateTime StudentChangeStart { get; set; } 
    public DateTime StudentChangeEnd { get; set; } 
    
    [Description("Thời gian bắt đầu học")]
    public DateTime EducationStart { get; set; }
    public DateTime EducationEnd { get; set; }
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
    
    public int NumberStudent { get; set; }
    public int NumberSubject { get; set; }
    public int NumberWish { get; set; }
    public string EventStoreId { get; set; }
    
}


