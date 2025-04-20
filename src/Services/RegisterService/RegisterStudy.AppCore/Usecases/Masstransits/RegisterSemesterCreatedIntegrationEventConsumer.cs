using Education.Contract.IntegrationEvents;
using MediatR;

namespace RegisterStudy.AppCore.Usecases.Masstransits;

public class RegisterSemesterCreatedIntegrationEventConsumer : INotificationHandler<RegisterSemesterCreatedIntegrationEvent>
{
    
    public Task Handle(RegisterSemesterCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}