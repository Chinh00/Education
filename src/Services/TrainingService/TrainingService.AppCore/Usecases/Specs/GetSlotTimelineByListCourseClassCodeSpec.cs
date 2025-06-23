using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineByListCourseClassCodeSpec(List<string> listCodes) : SpecificationBase<SlotTimeline>
{
    public override Expression<Func<SlotTimeline, bool>> Predicate => x => listCodes.Contains(x.CourseClassCode);
}