using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public class StudentEvictedIntegrationEventHandler(IMongoRepository<StudentSemester> studentSemesterRepository)
    : INotificationHandler<StudentEvictedIntegrationEvent>
{
    public async Task Handle(StudentEvictedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var studentSemester = await studentSemesterRepository.FindOneAsync(
            new GetStudentSemesterAndStudentCodeSpec(notification.SemesterCode, notification.StudentCode), cancellationToken);
        
        if (studentSemester == null)
        {
            return; // Student semester not found, nothing to do
        }

        studentSemester.CourseSubjects.Remove(notification.CourseClassCode);
        await studentSemesterRepository.UpsertOneAsync(
            new GetStudentSemesterAndStudentCodeSpec(notification.SemesterCode, notification.StudentCode), 
            studentSemester, cancellationToken);
    }
}