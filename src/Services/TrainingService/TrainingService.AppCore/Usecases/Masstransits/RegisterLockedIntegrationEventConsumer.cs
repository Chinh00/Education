using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Masstransits;

public class RegisterLockedIntegrationEventConsumer : INotificationHandler<RegisterLockedIntegrationEvent>
{
    private readonly IMongoRepository<StudentRegister> _studentRegisterRepository;

    public RegisterLockedIntegrationEventConsumer(IMongoRepository<StudentRegister> studentRegisterRepository)
    {
        _studentRegisterRepository = studentRegisterRepository;
    }

    public async Task Handle(RegisterLockedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var studentRegister =
            await _studentRegisterRepository.FindOneAsync(
                new GetStudentRegisterByStudentCodeSpec(notification.StudentCode), cancellationToken) ??
            new StudentRegister()
        {
            CorrelationId = notification.CorrelationId,
            StudentCode = notification.StudentCode,
            SubjectRegisters = []
        };
        var firstOrDefault = studentRegister.SubjectRegisters.FirstOrDefault(c => c.EducationCode != notification.EducationCode);
        if (firstOrDefault is null) studentRegister.SubjectRegisters.Add(new SubjectRegister()
        {
            EducationCode = notification.EducationCode,
            SubjectCodes = notification.SubjectCodes,
            RegisterDate = notification.RegisterDate,
        });
        await _studentRegisterRepository.UpsertOneAsync(new GetStudentRegisterByStudentCodeSpec(studentRegister.StudentCode), studentRegister, cancellationToken);
    }
}