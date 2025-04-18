using Education.Core.Domain;
using Education.Core.Specification;

namespace Education.Core.Repository;

public interface IRootRepository
{
    
}

public interface IMongoRepository<TEntity> : IRootRepository where TEntity : BaseEntity
{
    ValueTask<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken);
    ValueTask<List<TEntity>> FindAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default);
    ValueTask<List<TEntity>> FindAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default);

    ValueTask<TEntity> FindOneAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default);
    ValueTask<TEntity> FindOneAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default);
    ValueTask<long> CountAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default);
    ValueTask<TEntity> UpdateOneAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default);
    
    ValueTask<TEntity> UpsertOneAsync(ISpecification<TEntity> specification, TEntity entity, CancellationToken cancellationToken = default);
    
}