using MassTransit;
using MediatR;

namespace NotificationService.Infrastructure;

public class EventDispatcher : IConsumer<INotification>
{
    private readonly ILogger<EventDispatcher> _logger;
    private readonly IServiceProvider _serviceProvider;

    public EventDispatcher(ILogger<EventDispatcher> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task Consume(ConsumeContext<INotification> context)
    {
        _logger.LogInformation("Dispatching event: {IntegrationEvent}", context.Message.GetType().Name);
        var mediator = _serviceProvider.GetService<IMediator>();
        await mediator.Publish(context.Message);
    }
}