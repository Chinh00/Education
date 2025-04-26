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
                    logger.LogInformation($"Locked");                    
                })
                
                .TransitionTo(PendingState)
            // When(OrderStockValidatedFailIntegrationEvent).ThenAsync(async context => { }).TransitionTo(Cancel)
        );  
        
    }
    public State WishSubmitted { get; private set; }

    public State WishEnd { get; private set; }
    public State PendingState { get; private set; }
    
    
    
    public Event<WishListCreated> WishListCreated { get; private set; } = null!;
    public Event<WishListCreatedIntegrationEvent> WishListCreatedIntegrationEvent { get; private set; } = null!;
    public Event<WishListLockedIntegrationEvent> WishListLockedIntegrationEvent { get; private set; } = null!;
}