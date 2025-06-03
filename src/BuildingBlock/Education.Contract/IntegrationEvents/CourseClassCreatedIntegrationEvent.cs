using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public class CourseClassCreatedIntegrationEvent(
    string CourseClassCode,
    string CourseClassName,
    int CourseClassType,
    string SubjectCode,
    string SubjectName,
    string TeacherCode,
    string TeacherName,
    string SemesterCode,
    int Stage,
    List<SlotTime> slotTimes) : IIntegrationEvent
{
    
}
public record SlotTime(
    string CourseClassCode,
    string BuildingCode,
    string RoomCode,
    int DayOfWeek,
    List<string> Slot
);