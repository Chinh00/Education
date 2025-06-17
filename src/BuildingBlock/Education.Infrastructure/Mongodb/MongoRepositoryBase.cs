using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Education.Infrastructure.Mongodb;

public class MongoRepositoryBase<TEntity> : IMongoRepository<TEntity>
{
    private readonly IMongoCollection<TEntity> _mongoCollection;

    public MongoRepositoryBase(IOptions<MongoOptions> options)
    {
        _mongoCollection = new MongoClient(options.Value.ToString()).GetDatabase(options.Value.Database)
            .GetCollection<TEntity>(typeof(TEntity).Name);
    }

    public MongoRepositoryBase(IMongoCollection<TEntity> mongoCollection)
    {
        _mongoCollection = mongoCollection;
    }


    IQueryable<TEntity> GetQuery(IQueryable<TEntity> source, IListSpecification<TEntity> specification)
    {
        specification.Filters?.ForEach(e => source = source.Where(e));

        specification.Sorts?.ForEach(e => source = source.OrderBy(e));

        specification.SortsDesc?.ForEach(e => source = source.OrderByDescending(e));

        if (specification.IsPagingEnabled)
        {
            source = source.Skip(specification.Skip).Take(specification.Take);
        }
       
        if (specification.IncludeStrings is not null)
        {
            var expression = Core.Specification.Extensions.MakeSelectExpression(specification.IncludeStrings, specification.Includes);
            source = source.Select(expression);
        }
        
        return source;
    }
    IQueryable<TEntity> GetQuery(IQueryable<TEntity> source, ISpecification<TEntity> specification)
    {
        if (specification.Predicate is not null)
        {
            source = source.Where(specification.Predicate);
        }
        specification.Sorts?.ForEach(e => source = source.OrderBy(e));
        specification.SortsDesc?.ForEach(e => source = source.OrderByDescending(e));
        if (specification.IsPagingEnabled)
        {
            source = source.Skip(specification.Skip).Take(specification.Take);
        }

        if (specification.IncludeStrings is not null && specification.IncludeStrings.Any())
        {
            
        }
        return source;
    }


    public async ValueTask<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken)
    {
        await _mongoCollection.InsertOneAsync(entity, cancellationToken: cancellationToken);
        return entity;
    }

    public async ValueTask<List<TEntity>> FindAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        var query = GetQuery(_mongoCollection.AsQueryable(), specification);
        var result = await query.ToListAsync(cancellationToken);
        return result;
    }

    public async ValueTask<TEntity> FindOneAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        var query = GetQuery(_mongoCollection.AsQueryable(), specification);
        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    public ValueTask<TEntity> FindOneAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async ValueTask<List<TEntity>> FindAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        var query = GetQuery(_mongoCollection.AsQueryable(), specification);
        return await query.ToListAsync(cancellationToken: cancellationToken);
    }

    public async ValueTask<long> CountAsync(IListSpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        specification.IsPagingEnabled = false;
        var query = GetQuery(_mongoCollection.AsQueryable(), specification);
        return await query.CountAsync(cancellationToken: cancellationToken);
    }

    public ValueTask<TEntity> UpdateOneAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async ValueTask<TEntity> UpsertOneAsync(ISpecification<TEntity> specification, TEntity entity, CancellationToken cancellationToken = default)
    {
        await _mongoCollection.FindOneAndReplaceAsync(specification.Predicate, entity, new FindOneAndReplaceOptions<TEntity>()
        {
            IsUpsert = true
        }, cancellationToken);
        return entity;
    }

    public async ValueTask<TEntity> RemoveOneAsync(ISpecification<TEntity> specification, CancellationToken cancellationToken = default)
    {
        if (specification.Predicate == null)
            throw new ArgumentException("Specification.Predicate must not be null for deletion.");
        var deletedEntity = await _mongoCollection.FindOneAndDeleteAsync(
            Builders<TEntity>.Filter.Where(specification.Predicate),
            cancellationToken: cancellationToken
        );

        return deletedEntity;
    }
}