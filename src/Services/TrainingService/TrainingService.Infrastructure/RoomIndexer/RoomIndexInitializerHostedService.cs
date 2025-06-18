using Education.Core.Repository;

namespace TrainingService.Infrastructure.RoomIndexer;

public class RoomIndexInitializerHostedService (IServiceScopeFactory scopeFactory) : IHostedService
{

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var elasticManager = scope.ServiceProvider.GetRequiredService<IElasticManager>();
        await elasticManager.CreateIndexAsync<RoomIndexModel, string>("rooms");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}