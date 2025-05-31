using Education.Contract.IntegrationEvents;
using MediatR;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class CourseClassCreatedIntegrationEventHandler : INotificationHandler<CourseClassCreatedIntegrationEvent>
{
    public Task Handle(CourseClassCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}