using Education.Infrastructure.Redis;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RegisterStudy.AppCore.Repository;
using StackExchange.Redis;

namespace RegisterStudy.Infrastructure;

public class RedisRegisterRepository<TEntity>(IOptions<RedisOptions> redisOptions) : IRegisterRepository<TEntity>
{
    private readonly Lazy<ConnectionMultiplexer> _redis = new(
        ConnectionMultiplexer.Connect(redisOptions.Value.ToString() ?? string.Empty));

    private ConnectionMultiplexer Redis => _redis.Value;
    private readonly SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);

    private IDatabase Database
    {
        get
        {
            try
            {
                _semaphoreSlim.Wait();
                return Redis.GetDatabase();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }
    }


    public async Task<TEntity> SaveAsync(string key, Func<Task<TEntity>> func, DateTime staDate = default, DateTime endDate = default)
    {
        var data = await func();
        await Database.StringSetAsync(key, JsonConvert.SerializeObject(data));
        return data;
    }

    public async Task<TEntity> GetAsync(string key)
    {
        var value = await Database.StringGetAsync(key);
        return JsonConvert.DeserializeObject<TEntity>(value);
    }

    public Task<TEntity> HashSaveAsync(string key, Func<Task<TEntity>> func, DateTime staDate = default, DateTime endDate = default)
    {
        throw new NotImplementedException();
    }
}