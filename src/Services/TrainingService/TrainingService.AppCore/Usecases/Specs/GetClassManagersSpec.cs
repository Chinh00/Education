using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetClassManagersSpec : ListSpecification<ClassManager>
{
    public GetClassManagersSpec(IListQuery<ListResultModel<ClassManager>> query)
    {
        ApplyFilters(query.Filters);
        ApplySorts(query.Sorts);
        ApplyIncludes(query.Includes);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.ClassName);
        ApplyInclude(c => c.ClassCode);
        ApplyInclude(c => c.EducationCode);
        ApplyInclude(c => c.Id);
    }   
}