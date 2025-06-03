using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineByCourseClassCodesSpec : ListSpecificationBase<SlotTimeline>
{
    public GetSlotTimelineByCourseClassCodesSpec(List<string> courseClassCodes)
    {
        ApplyFilter(c => courseClassCodes.Contains(c.CourseClassCode));
        ApplyInclude(e => e.CourseClassCode);
        ApplyInclude(e => e.BuildingCode);
        ApplyInclude(e => e.RoomCode);
        ApplyInclude(e => e.DayOfWeek);
        ApplyInclude(e => e.Slots);
    }
}