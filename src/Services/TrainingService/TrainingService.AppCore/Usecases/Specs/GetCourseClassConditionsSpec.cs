using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassConditionsSpec : ListSpecificationBase<CourseClassCondition>
{
    public GetCourseClassConditionsSpec(IListQuery<ListResultModel<CourseClassCondition>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.ConditionName);
        ApplyInclude(c => c.ConditionCode);
        ApplyInclude(c => c.Id);
    }
}