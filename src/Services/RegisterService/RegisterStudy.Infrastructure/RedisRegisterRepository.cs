using Education.Infrastructure.Redis;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RegisterStudy.Domain.Repository;
using StackExchange.Redis;

namespace RegisterStudy.Infrastructure;

public class RedisRegisterRepository<TEntity>(IOptions<RedisOptions> redisOptions) : IRegisterRepository<TEntity>
{
    private readonly Lazy<ConnectionMultiplexer> _redis = new(
        ConnectionMultiplexer.Connect(redisOptions.Value.GetConnectionString() ?? string.Empty));

    private ConnectionMultiplexer Redis => _redis.Value;
    private readonly SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);
    private const string GetKeysLuaScript = "return redis.call('keys', ARGV[1])";
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
        return value.IsNullOrEmpty ? default : JsonConvert.DeserializeObject<TEntity>(value);
    }

    public async Task<TEntity> RemoveAsync(string key)
    {
        var value = await Database.StringGetAsync(key);
        if (value.IsNullOrEmpty) return default;
        await Database.KeyDeleteAsync(key);
        return JsonConvert.DeserializeObject<TEntity>(value);
    }

    public Task<TEntity> HashSaveAsync(string key, Func<Task<TEntity>> func, DateTime staDate = default, DateTime endDate = default)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<string>> GetKeysAsync(string pattern)
    {
        var result = await Database.ScriptEvaluateAsync(
            GetKeysLuaScript,
            values: new RedisValue[] { pattern });

        return ((RedisResult[])result)
            // .Where(x => x.ToString()!.StartsWith(_redisCacheOptions.Prefix))
            .Select(x => x.ToString())
            .ToArray();
    }

    public async Task<TEntity> GetOneAsync(string regex)
    {
        var result = await Database.ScriptEvaluateAsync(
            GetKeysLuaScript,
            values: [regex]); 
        var value = await Database.StringGetAsync(((RedisResult[])result)?.FirstOrDefault()?.ToString());
        return value.IsNullOrEmpty ? default : JsonConvert.DeserializeObject<TEntity>(value);
    }
}