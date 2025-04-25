using Education.Contract.IntegrationEvents;
using MassTransit;

namespace RegisterStudy.AppCore.Usecases.Masstransits;

public class WishLockHandler(ITopicProducer<WishListLockedIntegrationEvent> producer, ILogger<WishLockHandler> logger)
{
    public async Task Handle(Guid correlationId, CancellationToken cancellationToken)
    {
        logger.LogInformation("WishLockHandler");
        await producer.Produce(new {CorrelationId = correlationId}, cancellationToken);
    }
}