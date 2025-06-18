using Education.Core.Repository;

namespace TrainingService.Infrastructure.RoomIndexer;

public class RoomIndexManager(IElasticManager elasticManager) : IRoomIndexManager
{
    public async Task AddOrUpdateAsync(RoomIndexModel model)
    {
        await elasticManager.AddOrUpdateAsync<RoomIndexModel, string>("rooms", model);
    }
}