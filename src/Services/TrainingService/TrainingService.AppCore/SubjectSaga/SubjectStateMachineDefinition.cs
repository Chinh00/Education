using MassTransit;

namespace TrainingService.AppCore.SubjectSaga;

public class SubjectStateMachineDefinition : SagaDefinition<SubjectState>
{
    public SubjectStateMachineDefinition()
    {
        ConcurrentMessageLimit = 50;
    }

    protected override void ConfigureSaga(IReceiveEndpointConfigurator endpointConfigurator,
        ISagaConfigurator<SubjectState> sagaConfigurator,
        IRegistrationContext context)
    {
        endpointConfigurator.UseMessageRetry(r => r.Intervals(100, 200, 300));
        endpointConfigurator.UseInMemoryOutbox();
    }
}