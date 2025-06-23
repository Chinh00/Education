using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineBySemesterCodeAndStageAndListStaffCodeSpec : SpecificationBase<SlotTimeline>
{
    public GetSlotTimelineBySemesterCodeAndStageAndListStaffCodeSpec(string semesterCode, int stage, List<string> staffCodes)
    {
        Predicate = slot => slot.CourseClassCode.StartsWith(semesterCode) &&
                            (stage == 0 || stage == 2) ? slot.CourseClassCode.Contains("GD1") :
            (stage == 1 || stage == 3) && slot.CourseClassCode.Contains("GD2");
    }
    public override Expression<Func<SlotTimeline, bool>> Predicate { get; }
}