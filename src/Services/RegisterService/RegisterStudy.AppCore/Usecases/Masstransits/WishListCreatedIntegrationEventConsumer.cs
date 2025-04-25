using Education.Contract.IntegrationEvents;
using Education.Core.Utils;
using Hangfire;
using MediatR;

namespace RegisterStudy.AppCore.Usecases.Masstransits;

public class WishListCreatedIntegrationEventConsumer(IBackgroundJobClient jobClient)
    : INotificationHandler<WishListCreatedIntegrationEvent>
{

    public Task Handle(WishListCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var delay = notification.EndDate - DateTimeUtils.GetUtcTime();
        Console.WriteLine(notification.EndDate);
        Console.WriteLine(DateTimeUtils.GetUtcTime());
        if (delay <= TimeSpan.Zero) return Task.CompletedTask;
        jobClient.Schedule<WishLockHandler>(
            (x) => x.Handle(notification.CorrelationId, cancellationToken),
            delay
        );
        return Task.CompletedTask;
    }
}