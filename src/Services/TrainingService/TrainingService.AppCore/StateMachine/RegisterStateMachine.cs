using Education.Contract;
using Education.Contract.IntegrationEvents;
using MassTransit;
using MongoDB.Bson;

namespace TrainingService.AppCore.StateMachine;

public class RegisterStateMachine : MassTransitStateMachine<RegisterState>
{
    public RegisterStateMachine(ILogger<RegisterStateMachine> logger)
    {
        Event(() => StartRegisterPipelineIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => WishListCreatedIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => WishListLockedIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        Event(() => StudentRegistrationStartedIntegrationEvent, c => c.CorrelateById(x => x.Message.CorrelationId));
        
        InstanceState(e => e.CurrentState);
        Initially(
            When(StartRegisterPipelineIntegrationEvent)
                .ThenAsync(async context =>
                {
                    logger.LogInformation($"Register started {context.Message.CorrelationId}");
                    context.Saga.CorrelationId = context.Message.CorrelationId;
                    context.Saga.SemesterCode = context.Message.SemesterCode;
                    context.Saga.WishStartDate = context.Message.WishStartDate;
                    context.Saga.WishEndDate = context.Message.WishEndDate;
                    context.Saga.MinCredit = context.Message.MinCredit;
                    context.Saga.MaxCredit = context.Message.MaxCredit;
                })
                .Produce(context => context.Init<WishListCreatedIntegrationEvent>(new
                {                                                               
                    context.Saga.CorrelationId,
                    StartDate = context.Message.WishStartDate,
                    EndDate = context.Message.WishEndDate,
                    context.Message.SemesterCode,
                    context.Message.MinCredit,
                    context.Message.MaxCredit,
                }))
                .TransitionTo(Submitted)
        );
        
        
        During(Submitted,
            When(WishListLockedIntegrationEvent).ThenAsync(async (context) =>
                {
                    logger.LogInformation($"Register locked {context.Message.CorrelationId}"); 
                    context.Saga.NumberStudent = context.Message.NumberStudent;
                    context.Saga.NumberSubject = context.Message.NumberSubject;
                    context.Saga.NumberWish = context.Message.NumberWish;;
                })
                .TransitionTo(Schedule),
            When(StudentRegistrationStartedIntegrationEvent).ThenAsync(async context =>
            {
                logger.LogInformation($"Student register {context.Message.CorrelationId} StartDate: {context.Message.StudentRegisterStartDate} EndDate: {context.Message.StudentRegisterEndDate}"); 
                context.Saga.StudentRegisterStart = context.Message.StudentRegisterStartDate;
                context.Saga.StudentRegisterEnd = context.Message.StudentRegisterEndDate;;
            
            }).TransitionTo(StudentRegister)
        );  
        During(Schedule, When(StudentRegistrationStartedIntegrationEvent).ThenAsync(async context =>
        {
                    logger.LogInformation($"Student register {context.Message.CorrelationId} StartDate: {context.Message.StudentRegisterStartDate} EndDate: {context.Message.StudentRegisterEndDate}"); 
                    context.Saga.StudentRegisterStart = context.Message.StudentRegisterStartDate;
                    context.Saga.StudentRegisterEnd = context.Message.StudentRegisterEndDate;;
            
        }).TransitionTo(StudentRegister));
        
        
    }
    public State Submitted { get; private set; }
    
    public State Schedule { get; private set; }
    
    
    public State StudentRegister { get; private set; }
    public State Cancel { get; private set; }
    
    
    
    public Event<StartRegisterPipelineIntegrationEvent> StartRegisterPipelineIntegrationEvent { get; private set; } = null!;
    public Event<WishListCreatedIntegrationEvent> WishListCreatedIntegrationEvent { get; private set; } = null!;
    public Event<WishListLockedIntegrationEvent> WishListLockedIntegrationEvent { get; private set; } = null!;
    public Event<StudentRegistrationStartedIntegrationEvent> StudentRegistrationStartedIntegrationEvent { get; private set; } = null!;
}