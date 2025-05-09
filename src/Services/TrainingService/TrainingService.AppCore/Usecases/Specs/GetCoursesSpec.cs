using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCoursesSpec : ListSpecificationBase<Course>
{
    public GetCoursesSpec(IListQuery<ListResultModel<Course>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.CourseCode);
        ApplyInclude(c => c.CourseName);
        ApplyInclude(c => c.Id);
    }
}