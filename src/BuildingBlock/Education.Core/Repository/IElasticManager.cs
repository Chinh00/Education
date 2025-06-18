namespace Education.Core.Repository;
public interface IElasticEntity<TEntityKey>
{
    TEntityKey Id { get; }
}
public class ElasticEntity<TEntityKey> : IElasticEntity<TEntityKey>
{
    public TEntityKey Id { get; set; }
    public virtual string SearchingArea { get; set; }
    public virtual double? Score { get; set; }
}
public interface IElasticManager
{
    Task CreateIndexAsync<T, TKey>(string indexName) where T : ElasticEntity<TKey>;
    Task AddOrUpdateAsync<T, TKey>(string indexName, T model) where T : ElasticEntity<TKey>;
    Task DeleteIndexAsync(string indexName);
    
}