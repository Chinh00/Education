namespace Education.Infrastructure.Mongodb.Internal;

public class DataSeedHostedService<TEntity> : IHostedService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public DataSeedHostedService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await ExecuteAsync(cancellationToken);
    }

    protected virtual Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.CompletedTask;
    }
    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}