using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Contract.DomainEvents;

public record SemesterCreatedDomainEvent(string Id, string SemesterName, string SemesterCode, DateTime StartDate, DateTime EndDate) : DomainEventBase
{
} 