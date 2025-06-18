using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineBySemesterCodeAndListRoomCodeAndStageSpec(
    string semesterCode,
    string[] roomCodes,
    SubjectTimelineStage stage)
    : SpecificationBase<SlotTimeline>
{
    public override Expression<Func<SlotTimeline, bool>> Predicate => slotTimeline =>
        slotTimeline.CourseClassCode.Contains(semesterCode) &&
        roomCodes.Contains(slotTimeline.RoomCode) &&
        stage == SubjectTimelineStage.Stage1 || stage == SubjectTimelineStage.Stage1Of2
            ? slotTimeline.CourseClassCode.Contains("GD1") && slotTimeline.CourseClassCode.Contains("2GD1")
            : stage != SubjectTimelineStage.Stage2 && stage != SubjectTimelineStage.Stage2Of2 || slotTimeline.CourseClassCode.Contains("GD2") && slotTimeline.CourseClassCode.Contains("2GD2");
}