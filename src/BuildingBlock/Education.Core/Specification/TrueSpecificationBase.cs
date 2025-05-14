using System.Linq.Expressions;
using Education.Core.Domain;

namespace Education.Core.Specification;

public class TrueSpecificationBase<TEntity> : SpecificationBase<TEntity> where TEntity : BaseEntity
{
    public override Expression<Func<TEntity, bool>> Predicate => entity => true;
}