using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Contract.DomainEvents;

public record SemesterStatusChangedDomainEvent(string Id, string SemesterCode, int Status) : DomainEventBase
{
    
}