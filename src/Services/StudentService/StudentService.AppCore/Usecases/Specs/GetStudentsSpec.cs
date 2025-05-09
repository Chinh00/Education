using Education.Core.Domain;
using Education.Core.Specification;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.Specs;

public class GetStudentsSpec : ListSpecificationBase<Student>
{
    public GetStudentsSpec(IListQuery<ListResultModel<Student>> query)
    {
        ApplyFilters(query.Filters);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
    }
}