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
                new GetStudentRegisterByStudentCodeAndEducationCodeSpec(notification.StudentCode,
                    notification.EducationCode), cancellationToken) ??
            new StudentRegister()
        {
            CorrelationId = notification.CorrelationId,
            StudentCode = notification.StudentCode,
            EducationCode = notification.EducationCode,
            RegisterDate = notification.RegisterDate,
            SubjectCodes = notification.SubjectCodes,
        };
        await _studentRegisterRepository.UpsertOneAsync(
            new GetStudentRegisterByStudentCodeAndEducationCodeSpec(studentRegister.StudentCode,
                studentRegister.EducationCode), studentRegister,
            cancellationToken);
    }
}