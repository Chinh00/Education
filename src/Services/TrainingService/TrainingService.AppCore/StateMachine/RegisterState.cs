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
    [Description("Thời gian bắt đầu đăng ký nguện vọng")]
    
    public DateTime WishStartDate { get; set; }
    [Description("Thời gian bắt đầu đăng ký nguện vọng")]
    
    public DateTime WishEndDate { get; set; }
    [Description("Thời gian sinh viên bắt đầu đăng ký học phần")]
    public DateTime StudentRegisterStart { get; set; } 
    [Description("Thời gian sinh viên bắt đầu đăng ký học phần")]
    public DateTime StudentRegisterEnd { get; set; } 
    
    public int MinCredit { get; set; }
    public int MaxCredit { get; set; }
    
    public int NumberStudent { get; set; }
    public int NumberSubject { get; set; }
    public int NumberWish { get; set; }
    public string EventStoreId { get; set; }
    
}


