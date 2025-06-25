using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;
using StudentService.Domain.Enums;

namespace StudentService.AppCore.Usecases;

public class StudentCourseClassLockedIntegrationEventHandler(
    IMongoRepository<StudentSemester> studentSemesterRepository)
    : INotificationHandler<StudentCourseClassLockedIntegrationEvent>
{
    public async Task Handle(StudentCourseClassLockedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetStudentSemesterAndStudentCodeSpec(
            notification.StudentCode, notification.SemesterCode);
        var studentSemester = await studentSemesterRepository.FindOneAsync(spec, cancellationToken) ?? new StudentSemester()
        {
            StudentCode = notification.StudentCode,
            SemesterCode = notification.SemesterCode,
        };
        studentSemester.CourseSubjects = notification.CourseClassCodes;
        await studentSemesterRepository.UpsertOneAsync(spec, studentSemester, cancellationToken);
    }
}