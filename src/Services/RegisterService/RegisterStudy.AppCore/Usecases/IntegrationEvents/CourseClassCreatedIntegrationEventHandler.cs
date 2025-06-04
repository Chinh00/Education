using Education.Contract.IntegrationEvents;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class CourseClassCreatedIntegrationEventHandler(IRegisterRepository<RegisterCourseClass> registerRepository,
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
                    SlotTimes = notificationCourseClass.SlotTimes.Select(slotTime => new SlotTime(
                        slotTime.BuildingCode,
                        slotTime.RoomCode,
                        slotTime.DayOfWeek,
                        slotTime.Slot
                    )).ToList()
                }
                ));
        }
    }
}