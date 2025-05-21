using System.ComponentModel;
using Education.Core.Domain;
using MongoDB.Bson;

namespace Education.Contract.DomainEvents;
[Description("Tạo mới kì học")]
public record SemesterCreatedDomainEvent(string Id, string SemesterName, string SemesterCode, DateTime StartDate, DateTime EndDate) : DomainEventBase
{
} 