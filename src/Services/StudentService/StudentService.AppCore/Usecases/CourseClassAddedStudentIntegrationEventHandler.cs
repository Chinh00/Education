using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public class CourseClassAddedStudentIntegrationEventHandler(IMongoRepository<StudentSemester> studentSemesterRepository)
    : INotificationHandler<CourseClassAddedStudentIntegrationEvent>
{
    public async Task Handle(CourseClassAddedStudentIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetStudentSemesterAndStudentCodeSpec(notification.SemesterCode, notification.StudentCode);
        var studentSemester = await studentSemesterRepository.FindOneAsync(spec, cancellationToken) ?? new StudentSemester()
        {
            StudentCode = notification.StudentCode,
            SemesterCode = notification.SemesterCode,
        };
        
        if (!studentSemester.CourseSubjects.Contains(notification.TargetCourseClassCode))
        {
            studentSemester.CourseSubjects.Add(notification.TargetCourseClassCode);
            await studentSemesterRepository.UpsertOneAsync(spec, studentSemester, cancellationToken);
        }
    }
}