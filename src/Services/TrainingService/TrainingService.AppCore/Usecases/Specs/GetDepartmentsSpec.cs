using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetDepartmentsSpec : ListSpecification<Department>
{
    public GetDepartmentsSpec(IListQuery<ListResultModel<Department>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.DepartmentCode);
        ApplyInclude(c => c.DepartmentName);
        ApplyInclude(c => c.Id);
    }
}