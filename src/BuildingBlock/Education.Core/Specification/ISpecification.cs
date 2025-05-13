using System.Linq.Expressions;
using Education.Core.Domain;

namespace Education.Core.Specification;

public interface IRootSpecification<TEntity> {}

public interface ISpecification<TEntity> : IRootSpecification<TEntity>
{
    public Expression<Func<TEntity, bool>> Predicate { get;  }
    public List<Expression<Func<TEntity, object>>> Includes { get; }
    public List<string> IncludeStrings { get; }

    public List<Expression<Func<TEntity, object>>> Sorts { get; }
    public List<Expression<Func<TEntity, object>>> SortsDesc { get; }
    bool IsPagingEnabled { get; set; }
    int Skip { get; set; }
    int Take { get; set; }
}

public interface IListSpecification<TEntity> : IRootSpecification<TEntity>
{
    public List<Expression<Func<TEntity, bool>>> Filters { get; }
    public List<Expression<Func<TEntity, object>>> Includes { get; }
    public List<string> IncludeStrings { get; }

    public List<Expression<Func<TEntity, object>>> Sorts { get; }
    public List<Expression<Func<TEntity, object>>> SortsDesc { get; }
    bool IsPagingEnabled { get; set; }
    int Skip { get; set; }
    int Take { get; set; }
}