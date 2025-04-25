using MassTransit;

namespace TrainingService.AppCore.StateMachine;

public class RegisterStateMachineDefinition : SagaDefinition<RegisterState>
{
    public RegisterStateMachineDefinition()
    {
        ConcurrentMessageLimit = 50;
    }

    protected override void ConfigureSaga(IReceiveEndpointConfigurator endpointConfigurator,
        ISagaConfigurator<RegisterState> sagaConfigurator,
        IRegistrationContext context)
    {
        endpointConfigurator.UseMessageRetry(r => r.Intervals(100, 200, 300));
        endpointConfigurator.UseInMemoryOutbox();
    }

     
}