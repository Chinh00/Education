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
        
        InstanceState(e => e.CurrentState);
        Initially(
            When(StartRegisterPipelineIntegrationEvent)
                .ThenAsync(async context =>
                {
                    logger.LogInformation($"Register started {context.Message.CorrelationId}");
                    context.Saga.CorrelationId = context.Message.CorrelationId;
                    context.Saga.EventStoreId = context.Message.EventStoreId;
                    context.Saga.SemesterCode = context.Message.SemesterCode;
                    context.Saga.StartDate = context.Message.StartDate;
                    context.Saga.EndDate = context.Message.EndDate;
                    context.Saga.StudentChangeStart = context.Message.StudentChangeStart;
                    context.Saga.StudentChangeEnd = context.Message.StudentChangeEnd;
                    context.Saga.EducationStart = context.Message.EducationStart;
                    context.Saga.EducationEnd = context.Message.EducationEnd;
                    context.Saga.MinCredit = context.Message.MinCredit;
                    context.Saga.MaxCredit = context.Message.MaxCredit;
                })
                .Produce(context => context.Init<WishListCreatedIntegrationEvent>(new
                {                                                               
                    context.Saga.CorrelationId,
                    context.Message.StartDate,
                    context.Message.EndDate,
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
                .TransitionTo(Schedule)
        );  
        
        
        
    }
    public State Submitted { get; private set; }
    
    public State Schedule { get; private set; }
    
    public State AssignTeacher { get; private set; }
    
    
    public State StudentChange { get; private set; }
    public State Cancel { get; private set; }
    
    
    
    public Event<StartRegisterPipelineIntegrationEvent> StartRegisterPipelineIntegrationEvent { get; private set; } = null!;
    public Event<WishListCreatedIntegrationEvent> WishListCreatedIntegrationEvent { get; private set; } = null!;
    public Event<WishListLockedIntegrationEvent> WishListLockedIntegrationEvent { get; private set; } = null!;
}