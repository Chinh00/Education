using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineFreeByRoomSpec(string semestersCode, SubjectTimelineStage stage) : SpecificationBase<SlotTimeline>
{
    public override Expression<Func<SlotTimeline, bool>> Predicate
    {
        get
        {
            return timeline =>
                timeline.CourseClassCode.StartsWith(semestersCode) &&
                (
                    (stage == SubjectTimelineStage.Stage1 || stage == SubjectTimelineStage.Stage1Of2) && (timeline.CourseClassCode.Contains("GD1") || timeline.CourseClassCode.Contains("2GD1"))
                    ||
                    (stage == SubjectTimelineStage.Stage2 || stage == SubjectTimelineStage.Stage2Of2) && (timeline.CourseClassCode.Contains("GD2") || timeline.CourseClassCode.Contains("2GD2"))
                );
        }
    }
}