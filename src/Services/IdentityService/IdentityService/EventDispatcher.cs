using Education.Core.Domain;
using MassTransit;
using MediatR;

namespace IdentityService;

public class EventDispatcher : IConsumer<IIntegrationEvent>
{
    private readonly ILogger<EventDispatcher> _logger;
    private readonly IServiceProvider _serviceProvider;

    public EventDispatcher(ILogger<EventDispatcher> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task Consume(ConsumeContext<IIntegrationEvent> context)
    {
        var mediator = _serviceProvider.GetService<IMediator>();
        await mediator.Publish(context.Message);
    }
}