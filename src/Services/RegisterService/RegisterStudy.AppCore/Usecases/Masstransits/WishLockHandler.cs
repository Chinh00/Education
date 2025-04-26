using Education.Contract.IntegrationEvents;
using MassTransit;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Masstransits;

public class WishLockHandler(
    ITopicProducer<WishListLockedIntegrationEvent> producer,
    ITopicProducer<RegisterLockedIntegrationEvent> topicProducer,
    ILogger<WishLockHandler> logger,
    IRegisterRepository<StudentRegister> registerRepository)
{
    public async Task Handle(Guid correlationId, CancellationToken cancellationToken)
    {
        var keys = await registerRepository.GetKeysAsync("subjects:*");
        await producer.Produce(new {CorrelationId = correlationId}, cancellationToken);
        foreach (var key in keys)
        {
            var split = key.Split(":");
            var register = await registerRepository.GetAsync(key);
            await topicProducer.Produce(new
            {
                CorrelationId = correlationId,
                EducationCode = split[2],
                StudentCode = split[1],
                SubjectCodes = register.SubjectRegisters?.Select(c => c.SubjectCodes).FirstOrDefault() ?? []
            }, cancellationToken);
        }
    }
}