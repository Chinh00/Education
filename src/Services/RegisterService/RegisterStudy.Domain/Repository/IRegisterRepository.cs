namespace RegisterStudy.Domain.Repository;

public interface IRegisterRepository<TEntity>
{
    Task<TEntity> SaveAsync(string key, Func<Task<TEntity>> func, DateTime staDate = default, DateTime endDate = default);
    Task<TEntity> GetAsync(string key);
    Task<TEntity> RemoveAsync(string key);
    Task<TEntity> HashSaveAsync(string key, Func<Task<TEntity>> func, DateTime staDate = default, DateTime endDate = default);
    
    
}