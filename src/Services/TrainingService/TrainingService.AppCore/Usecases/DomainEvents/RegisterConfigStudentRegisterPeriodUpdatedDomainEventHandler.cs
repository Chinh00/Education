using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MassTransit;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.Usecases.Specs;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class
    RegisterConfigStudentRegisterPeriodUpdatedDomainEventHandler : INotificationHandler<
    RegisterConfigStudentRegisterPeriodUpdatedDomainEvent>
{
    private readonly ITopicProducer<StudentRegistrationStartedIntegrationEvent> _topicProducer;
    private readonly IMongoRepository<RegisterState> _repository;
    
    public RegisterConfigStudentRegisterPeriodUpdatedDomainEventHandler(
        ITopicProducer<StudentRegistrationStartedIntegrationEvent> topicProducer, IOptions<MongoOptions> mnOptions)
    {
        _topicProducer = topicProducer;
        _repository = new MongoRepositoryBase<RegisterState>(new MongoClient(mnOptions.Value.ToString())
            .GetDatabase(mnOptions.Value.Database)
            .GetCollection<RegisterState>("RegisterSaga"));
    }

    public async Task Handle(RegisterConfigStudentRegisterPeriodUpdatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        var spec = new GetRegisterStateBySemesterCodeSpec(notification.SemesterCode);
        var registerState = await _repository.FindOneAsync(spec, cancellationToken);
        await _topicProducer.Produce(new StudentRegistrationStartedIntegrationEvent
        {
            CorrelationId = registerState.CorrelationId,
            StudentRegisterStartDate = notification.StudentRegisterStart,
            StudentRegisterEndDate = notification.StudentRegisterEnd,
        }, cancellationToken);
    }
}