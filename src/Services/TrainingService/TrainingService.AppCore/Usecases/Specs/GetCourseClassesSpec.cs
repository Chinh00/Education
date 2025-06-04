using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassesSpec : ListSpecificationBase<CourseClass>
{
    public GetCourseClassesSpec(IListQuery<ListResultModel<CourseClass>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.CourseClassType);
        ApplyInclude(c => c.TeacherCode);
        ApplyInclude(c => c.TeacherName);
        ApplyInclude(c => c.SubjectCode);
        ApplyInclude(c => c.CourseClassCode);
        ApplyInclude(c => c.CourseClassName);
        ApplyInclude(c => c.Stage);
        ApplyInclude(c => c.WeekStart);
        ApplyInclude(c => c.Status);
        ApplyInclude(c => c.NumberStudentsExpected);
        ApplyInclude(c => c.ParentCourseClassCode);
    }
}