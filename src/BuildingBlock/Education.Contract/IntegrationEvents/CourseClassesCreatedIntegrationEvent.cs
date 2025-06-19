using Education.Core.Domain;

namespace Education.Contract.IntegrationEvents;

public record CourseClassesCreatedIntegrationEvent(
    string SemesterCode,
    DateTime StudentRegisterStart,
    DateTime StudentRegisterEnd,
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
    int WeekEnd,
    string ParentCourseClassCode,
    int Stage,
    DateTime StartDate,
    DateTime EndDate,
    List<SlotTimelineEvent> SlotTimes);

public record SlotTimelineEvent(
    string BuildingCode,
    string RoomCode,
    int DayOfWeek,
    List<string> Slots,
    int WeekStart,
    int WeekEnd
);