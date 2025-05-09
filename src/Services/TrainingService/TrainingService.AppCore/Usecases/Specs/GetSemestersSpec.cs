using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSemestersSpec : ListSpecificationBase<Semester>
{
    public GetSemestersSpec(IListQuery<ListResultModel<Semester>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.SemesterCode);
        ApplyInclude(c => c.SemesterName);
        ApplyInclude(c => c.StartDate);
        ApplyInclude(c => c.EndDate);
        ApplyInclude(c => c.Id);
    }
}