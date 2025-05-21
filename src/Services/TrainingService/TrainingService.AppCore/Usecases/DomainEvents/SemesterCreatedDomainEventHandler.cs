using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class SemesterCreatedDomainEventHandler : INotificationHandler<SemesterCreatedDomainEvent>
{
    private readonly IMongoRepository<Semester> _repository;

    public SemesterCreatedDomainEventHandler(IMongoRepository<Semester> repository)
    {
        _repository = repository;
    }

    public async Task Handle(SemesterCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await _repository.AddAsync(new Semester()
        {
            Id = ObjectId.Parse(notification.Id),
            SemesterName = notification.SemesterName,
            StartDate = notification.StartDate,
            EndDate = notification.EndDate,
            SemesterCode = notification.SemesterCode,
            Version = notification.Version,
        }, cancellationToken);
    }
}