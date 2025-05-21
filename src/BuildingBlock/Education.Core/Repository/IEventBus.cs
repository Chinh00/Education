using Education.Core.Domain;

namespace Education.Core.Repository;

public interface IEventBus
{
    Task Publish(ICollection<IDomainEvent> @events, CancellationToken cancellation);
}