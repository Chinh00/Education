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
        ApplyInclude(c => c.SlotTimelines);
        ApplyInclude(c => c.CourseClassType);
        ApplyInclude(c => c.ClassIndex);
        ApplyInclude(c => c.CorrectionId);
        ApplyInclude(c => c.RoomCode);
        ApplyInclude(c => c.BuildingCode);
        ApplyInclude(c => c.SubjectCode);
    }
}