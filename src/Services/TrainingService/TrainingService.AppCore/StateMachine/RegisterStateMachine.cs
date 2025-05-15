using Education.Contract;
using Education.Contract.IntegrationEvents;
using MassTransit;

namespace TrainingService.AppCore.StateMachine;

public class RegisterStateMachine : MassTransitStateMachine<RegisterState>
{
    public RegisterStateMachine(ILogger<RegisterStateMachine> logger)
    {
       
        Event(() => WishListCreatedIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => WishListCreated, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => WishListLockedIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => GenerateScheduleCreated, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => GenerateScheduleSuccess, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => GenerateScheduleFail, c => c.CorrelateById(x => x.Message.CorrelationId));
        InstanceState(e => e.CurrentState);
        Initially(
            When(WishListCreated)
                .ThenAsync(async context =>
                {
                    logger.LogInformation($"Register submitted {context.Message.CorrelationId}");
                    context.Saga.CorrelationId = context.Message.CorrelationId;
                    context.Saga.StartDate = context.Message.StartDate;
                    context.Saga.EndDate = context.Message.EndDate;
                    context.Saga.SemesterCode = context.Message.SemesterCode;
                    context.Saga.SemesterName = context.Message.SemesterName;
                    context.Saga.MinCredit = context.Message.MinCredit;
                    context.Saga.MaxCredit = context.Message.MaxCredit;
                })
                .Produce(context => context.Init<WishListCreatedIntegrationEvent>(new
                {                                                               
                    context.Saga.CorrelationId,
                    context.Message.StartDate,
                    context.Message.EndDate,
                    context.Message.SemesterCode,
                    context.Message.SemesterName,
                    context.Message.MinCredit,
                    context.Message.MaxCredit,
                }))
                .TransitionTo(WishSubmitted)
        );
        
        
        During(WishSubmitted, Ignore(WishListCreated),
            When(WishListLockedIntegrationEvent).ThenAsync(async (context) =>
                {
                    logger.LogInformation($"Register locked {context.Message.CorrelationId}");                    
                    logger.LogInformation($"Start generate schedule {context.Message.CorrelationId}");                    
                })
                .Produce(context => context.Init<GenerateScheduleCreated>(new
                {
                    context.Saga.CorrelationId,
                }))
                .TransitionTo(GenerateSchedule)
        );  
        
        During(GenerateSchedule, 
            Ignore(GenerateScheduleCreated),
            When(GenerateScheduleSuccess).ThenAsync(async (context) =>
            {
                logger.LogInformation($"Schedule generated {context.Message.CorrelationId}");
            }).TransitionTo(AdminChanging),
            When(GenerateScheduleFail).ThenAsync(async (context) =>
            {
                logger.LogInformation($"Schedule generated fail {context.Message.CorrelationId}");
            }).TransitionTo(PendingState)
            );
        
    }
    // Đăng ký nguyện vọng học
    public State WishSubmitted { get; private set; }
    
    // Hệ thống tự động tạo thời khóa biểu
    public State GenerateSchedule { get; private set; }
    
    // Quản trị thay đổi
    public State AdminChanging { get; private set; }
    
    
    public State PendingState { get; private set; }
    
    
    
    public Event<WishListCreated> WishListCreated { get; private set; } = null!;
    public Event<WishListCreatedIntegrationEvent> WishListCreatedIntegrationEvent { get; private set; } = null!;
    public Event<WishListLockedIntegrationEvent> WishListLockedIntegrationEvent { get; private set; } = null!;
    public Event<GenerateScheduleCreated> GenerateScheduleCreated { get; private set; } = null!;
    public Event<GenerateScheduleSuccess> GenerateScheduleSuccess { get; private set; } = null!;
    public Event<GenerateScheduleFail> GenerateScheduleFail { get; private set; } = null!;
}