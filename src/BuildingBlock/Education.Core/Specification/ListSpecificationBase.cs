using System.Linq.Expressions;
using Education.Core.Domain;

namespace Education.Core.Specification;

public class ListSpecificationBase<TEntity> : IListSpecification<TEntity>
{
    public List<Expression<Func<TEntity, bool>>> Filters { get; } = [];
    public List<Expression<Func<TEntity, object>>> Includes { get; } = [];
    public List<string> IncludeStrings { get; } = [];
    public List<Expression<Func<TEntity, object>>> Sorts { get; } = [];
    public List<Expression<Func<TEntity, object>>> SortsDesc { get; } = [];
    public bool IsPagingEnabled { get; set; }
    public int Skip { get; set; } = 1;
    public int Take { get; set; } = 10;
    
    public void ApplyFilter(Expression<Func<TEntity, bool>> filter)
    {
        Filters.Add(filter);
    }

    public void ApplyFilter(FilterModel filterModel) => Filters.Add(Extensions.MakeFilterExpression<TEntity>(filterModel));
    public void ApplyFilters(List<Expression<Func<TEntity, bool>>> filters) => Filters.AddRange(filters);
    public void ApplyFilters(List<FilterModel> filterModels) => filterModels.ForEach(ApplyFilter);
    
    public void ApplyInclude(string includeString) => IncludeStrings.Add(includeString);
    public void ApplyIncludes(List<string> includeStrings) => IncludeStrings.AddRange(includeStrings);
    public void ApplyInclude(Expression<Func<TEntity, object>> includeString) => Includes.Add(includeString);
    public void ApplyIncludes(List<Expression<Func<TEntity, object>>> expressions) => Includes.AddRange(expressions);

    public void ApplySorting(string sortBy) =>
        this.ApplySorting<TEntity>(sortBy, nameof(ApplySortAsc), nameof(ApplySortDesc));
    public void ApplySorting(List<string> sortBys) => sortBys?.ForEach(ApplySorting);

    public void ApplySorts(List<string> sorts) => sorts.ForEach(ApplySorting);
    
    
    public void ApplySortAsc(Expression<Func<TEntity, object>> sortBy) => Sorts.Add(sortBy);
    public void ApplySortDesc(Expression<Func<TEntity, object>> sortBy) => SortsDesc.Add(sortBy);

    public void ApplyPaging(int page, int pageSize)
    {
        IsPagingEnabled = true;
        Skip = (page - 1) * pageSize;
        Take = pageSize;
    }

}