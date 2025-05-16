using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelinesSpec : ListSpecificationBase<SlotTimeline>
{
    public GetSlotTimelinesSpec(IListQuery<ListResultModel<SlotTimeline>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.CourseClassCode);
        ApplyInclude(c => c.BuildingCode);
        ApplyInclude(c => c.RoomCode);
        ApplyInclude(c => c.DayOfWeek);
        ApplyInclude(c => c.Slots);
    }
}