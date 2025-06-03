using Education.Contract.IntegrationEvents;
using MassTransit;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class WishLockHandler(
    ITopicProducer<RegisterLockedIntegrationEvent> topicProducer,
    ILogger<WishLockHandler> logger,
    IRegisterRepository<StudentRegister> registerRepository)
{
    public async Task Handle(Guid correlationId, string semesterCode, CancellationToken cancellationToken)
    {
        
        var keys = await registerRepository.GetKeysAsync("subjects:*");
        var registerLockedIntegrationEvent = new RegisterLockedIntegrationEvent
        {
            CorrelationId = correlationId,
            SemesterCode = semesterCode,
            Students = new List<StudentRegisterConfirm>()
        };
        foreach (var key in keys)
        {
            var split = key.Split(":");
            var register = await registerRepository.GetAsync(key);
            registerLockedIntegrationEvent.Students.Add(new StudentRegisterConfirm()
            {
                StudentCode = split[1],
                EducationCode = split[2],
                RegisterDate = register.RegisterDate,
                SubjectCodes = register.SubjectCodes,
            });
        }
        await topicProducer.Produce(registerLockedIntegrationEvent, cancellationToken);
    }
}