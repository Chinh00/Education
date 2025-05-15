using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : BaseEntity
{
    public int ClassIndex { get; set; } 
    public List<string> StudentIds { get; set; }
    public CourseClassType CourseClassType { get; set; }
    public string SubjectCode { get; set; }
    public int SessionLength { get; set; }
    public Guid CorrectionId { get; set; }
    public List<SlotTimeline> SlotTimelines { get; set; } = [];
    public string RoomCode { get; set; }
    public string BuildingCode { get; set; }
    public int Session { get; set; }
    public int DurationInWeeks { get; set; }
}

public class SlotTimeline
{
    public int DayOfWeek { get; set; }
    public List<string> Slots { get; set; }
}