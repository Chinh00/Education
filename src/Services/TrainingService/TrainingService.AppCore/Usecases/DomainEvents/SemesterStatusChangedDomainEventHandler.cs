using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class SemesterStatusChangedDomainEventHandler(IMongoRepository<Semester> repository)
    : INotificationHandler<SemesterStatusChangedDomainEvent>
{

    public async Task Handle(SemesterStatusChangedDomainEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetSemesterByCodeSpec(notification.SemesterCode);
        var semester = await repository.FindOneAsync(spec, cancellationToken);
        semester.SemesterStatus = (SemesterStatus)notification.Status;
        semester.Version = notification.Version;
        await repository.UpsertOneAsync(spec, semester, cancellationToken);
    }
}