using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record CourseClassesCreatedIntegrationEvent(
    string SemesterCode,
    DateTime StudentRegisterStart,
    DateTime StudentRegisterEnd,
    DateTime SemesterStart,
    DateTime SemesterEnd,
    List<CourseClassEvent> CourseClasses
) : IIntegrationEvent;
public record CourseClassEvent(
    string CourseClassCode,
    string CourseClassName,
    int CourseClassType,
    string SubjectCode,
    string SubjectName,
    int NumberOfCredits,
    string TeacherCode,
    string TeacherName,
    int NumberStudentsExpected,
    int WeekStart,
    string ParentCourseClassCode,
    int Stage,
    List<SlotTimelineEvent> SlotTimes);

public record SlotTimelineEvent(
    string BuildingCode,
    string RoomCode,
    int DayOfWeek,
    List<string> Slot
);