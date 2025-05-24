using System.ComponentModel;
using Education.Core.Domain;

namespace Education.Contract.DomainEvents;
[Description("Thêm mới thời gian học")]
public record SlotTimelineCreatedDomainEvent(
    string AggregateId,
    string CourseClassCode,
    string BuildingCode,
    string RoomCode,
    int DayOfWeek,
    List<string> Slot) : DomainEventBase
{
    
}