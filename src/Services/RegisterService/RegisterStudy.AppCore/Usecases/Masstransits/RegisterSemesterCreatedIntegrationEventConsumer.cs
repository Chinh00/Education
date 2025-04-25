using Education.Contract.IntegrationEvents;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Masstransits;

public class RegisterSemesterCreatedIntegrationEventConsumer(IRegisterRepository<RegisterCourse> registerRepository)
    : INotificationHandler<RegisterSemesterCreatedIntegrationEvent>
{
    public async Task Handle(RegisterSemesterCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var key = $"education:{notification.EducationCode}";
        var registerCourse = await registerRepository.GetAsync(key);
        if (registerCourse is not null) return;
        await registerRepository.SaveAsync(key, () => Task.FromResult(new RegisterCourse()
        {
            EducationCode = notification.EducationCode,
            EducationName = notification.EducationName,
            CourseCode = notification.CourseCode,
            CourseName = notification.CourseName,
            SemesterCode = notification.SemesterCode,
            SemesterName = notification.SemesterName,
            Subjects = notification.Subjects.Select(c => new SubjectRegister()
            {
                SubjectCode = c.SubjectCode,
                SubjectName = c.SubjectName,
            }).ToList()
        }));
        

    }
}