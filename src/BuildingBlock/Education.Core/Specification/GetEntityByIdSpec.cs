using System.Linq.Expressions;
using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Core.Specification;

public class GetEntityByIdSpec<TEntity>(ObjectId id) : SpecificationBase<TEntity>
    where TEntity : BaseEntity
{
    public override Expression<Func<TEntity, bool>> Predicate => x => x.Id == id;
}