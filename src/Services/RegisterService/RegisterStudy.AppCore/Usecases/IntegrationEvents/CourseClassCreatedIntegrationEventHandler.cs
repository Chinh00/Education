using Education.Contract.IntegrationEvents;
using Education.Core.Utils;
using Hangfire;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class CourseClassCreatedIntegrationEventHandler(IRegisterRepository<RegisterCourseClass> registerRepository, IBackgroundJobClient jobClient,
    IRegisterRepository<CourseClass> courseClassRepository
    )
    : INotificationHandler<CourseClassesCreatedIntegrationEvent>
{
    public async Task Handle(CourseClassesCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var key = RedisKey.StudentRegister;
        await registerRepository.SaveAsync(nameof(RegisterCourseClass), () => Task.FromResult(new RegisterCourseClass()
        {
            SemesterCode = notification.SemesterCode,
            StudentRegisterEnd = notification.StudentRegisterEnd,
            StudentRegisterStart = notification.StudentRegisterStart
        }));
        var delay = TimeZoneInfo
            .ConvertTimeFromUtc(notification.StudentRegisterEnd, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")) - DateTimeUtils.GetUtcTime();
        if (delay <= TimeSpan.Zero) await Task.CompletedTask;
        foreach (var notificationCourseClass in notification.CourseClasses)
        {
            var courseSubjetKey = RedisKey.SubjectCourseClass(notification.SemesterCode,
                notificationCourseClass.SubjectCode, notificationCourseClass.CourseClassCode);
            await courseClassRepository.SaveAsync(courseSubjetKey, () => Task.FromResult(
                new CourseClass()
                {
                    SemesterCode = notification.SemesterCode,
                    SubjectCode = notificationCourseClass.SubjectCode,
                    SubjectName = notificationCourseClass.SubjectName,
                    CourseClassCode = notificationCourseClass.CourseClassCode,
                    CourseClassName = notificationCourseClass.CourseClassName,
                    CourseClassType = notificationCourseClass.CourseClassType,
                    NumberOfCredits = notificationCourseClass.NumberOfCredits,
                    TeacherCode = notificationCourseClass.TeacherCode,
                    TeacherName = notificationCourseClass.TeacherName,
                    Stage = notificationCourseClass.Stage,
                    NumberStudentsExpected = notificationCourseClass.NumberStudentsExpected,
                    StartDate = notificationCourseClass.StartDate,
                    EndDate = notificationCourseClass.EndDate,
                    ParentCourseClassCode = notificationCourseClass.ParentCourseClassCode,
                    WeekStart = notificationCourseClass.WeekStart,
                    SlotTimes = notificationCourseClass.SlotTimes.Select(slotTime => new SlotTime(
                        slotTime.BuildingCode,
                        slotTime.RoomCode,
                        slotTime.DayOfWeek,
                        slotTime.Slot
                    )).ToList()
                }
                ));
        }
        jobClient.Schedule<CourseClassLockHandler>(
            (x) => x.Handle(notification.SemesterCode, cancellationToken),
            delay
        );
    }
}