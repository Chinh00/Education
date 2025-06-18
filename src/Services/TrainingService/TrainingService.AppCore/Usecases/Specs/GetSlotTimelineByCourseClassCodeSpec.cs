using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineByCourseClassCodeSpec(string courseClass) : SpecificationBase<SlotTimeline>
{
    public override Expression<Func<SlotTimeline, bool>> Predicate => x => x.CourseClassCode == courseClass;
}