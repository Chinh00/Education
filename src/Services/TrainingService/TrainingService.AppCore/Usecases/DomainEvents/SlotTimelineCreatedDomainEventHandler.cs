using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class SlotTimelineCreatedDomainEventHandler(IMongoRepository<SlotTimeline> repository)
    : INotificationHandler<SlotTimelineCreatedDomainEvent>
{
    public async Task Handle(SlotTimelineCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new SlotTimeline()
        {
            Id = ObjectId.Parse(notification.AggregateId),
            CourseClassCode = notification.CourseClassCode,
            BuildingCode = notification.BuildingCode,
            RoomCode = notification.RoomCode,
            DayOfWeek = notification.DayOfWeek,
            Slots = notification.Slot,
            Version = notification.Version,
        }, cancellationToken);
    }
}