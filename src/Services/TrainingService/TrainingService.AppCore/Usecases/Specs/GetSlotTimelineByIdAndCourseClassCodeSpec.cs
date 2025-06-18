using System.Linq.Expressions;
using Education.Core.Specification;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSlotTimelineByIdAndCourseClassCodeSpec(ObjectId id, string courseClassCode) : SpecificationBase<SlotTimeline>
{
    public override Expression<Func<SlotTimeline, bool>> Predicate => slotTimeline => slotTimeline.Id == id && slotTimeline.CourseClassCode == courseClassCode;
}