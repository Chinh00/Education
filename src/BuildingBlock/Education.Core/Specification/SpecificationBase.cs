using System.Linq.Expressions;
using Education.Core.Domain;

namespace Education.Core.Specification;

public abstract class SpecificationBase<TEntity> : ISpecification<TEntity> where TEntity : BaseEntity
{
    public abstract Expression<Func<TEntity, bool>> Filter { get; }
    public List<Expression<Func<TEntity, object>>> Includes { get; } = [];
    public List<string> IncludeStrings { get; } = [];
    public List<Expression<Func<TEntity, object>>> Sorts { get; } = [];
    public List<Expression<Func<TEntity, object>>> SortsDesc { get; } = [];
    public bool IsPagingEnabled { get; set; } = false;
    public int Skip { get; set; } = 1;
    public int Take { get; set; } = 10;
    public void ApplyInclude(string includeString) => IncludeStrings.Add(includeString);
    public void ApplyInclude(List<string> includeStrings) => IncludeStrings.AddRange(includeStrings);
    public void ApplyIncludes(Expression<Func<TEntity, object>> includeString) => Includes.Add(includeString);
    public void ApplyIncludes(List<Expression<Func<TEntity, object>>> expressions) => Includes.AddRange(expressions);

    public void ApplySorting(string sortBy) =>
        this.ApplySorting<TEntity>(sortBy, nameof(ApplySortAsc), nameof(ApplySortDesc));
    
    public void ApplySortAsc(Expression<Func<TEntity, object>> sortBy) => Sorts.Add(sortBy);
    public void ApplySortDesc(Expression<Func<TEntity, object>> sortBy) => SortsDesc.Add(sortBy);

    public void ApplyPaging(int page, int pageSize)
    {
        IsPagingEnabled = true;
        Skip = (page - 1) * pageSize;
        Take = pageSize;
    }
    
    
    
    
}