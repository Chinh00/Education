namespace TrainingService.Infrastructure.RoomIndexer;

public interface IRoomIndexManager
{
    Task AddOrUpdateAsync(RoomIndexModel model);
}