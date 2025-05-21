using System.ComponentModel;
using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Contract.DomainEvents;
[Description("Thay đổi trạng thái kì học")]
public record SemesterStatusChangedDomainEvent(string Id, string SemesterCode, int Status) : DomainEventBase
{
    
}