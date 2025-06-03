using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Core.Services;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Masstransits;
    

public class RegisterLockedIntegrationEventConsumer(
    ITopicProducer<WishListLockedIntegrationEvent> producer,
    IMongoRepository<SubjectRegister> repository
    )
    : INotificationHandler<RegisterLockedIntegrationEvent>
{
    public async Task Handle(RegisterLockedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        
        
        var subjectGroups = notification.Students
            .SelectMany(s => s.SubjectCodes.Select(code => new
            {
                SubjectCode = code,
                StudentCode = s.StudentCode
            }))
            .GroupBy(x => x.SubjectCode)
            .Select(g => new
            {
                SubjectCode = g.Key,
                StudentCodes = g.Select(x => x.StudentCode).ToList()
            })
            .ToList();
        foreach (var subjectGroup in subjectGroups)
        {
            var subjectRegister = new SubjectRegister()
            {
                SubjectCode = subjectGroup.SubjectCode,
                StudentCodes = subjectGroup?.StudentCodes,
                SemesterCode = notification.SemesterCode
            };
            await repository.AddAsync(subjectRegister, cancellationToken);
        }
        var studentCount = notification.Students.Count;

        var subjectCount = notification.Students
            .SelectMany(s => s.SubjectCodes)
            .Distinct()
            .Count();

        var totalPreferences = notification.Students
            .Sum(s => s.SubjectCodes.Count);
        await producer.Produce(new WishListLockedIntegrationEvent()
        {
            CorrelationId = notification.CorrelationId,
            NumberStudent = studentCount,
            NumberSubject = subjectCount,
            NumberWish = totalPreferences,
        }, cancellationToken);
    }
}