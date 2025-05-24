using Education.Contract.DomainEvents;
using Education.Core.Repository;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class CourseClassCreatedDomainEventHandler(IMongoRepository<CourseClass> repository)
    : INotificationHandler<CourseClassCreatedDomainEvent>
{
    public async Task Handle(CourseClassCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await repository.AddAsync(new CourseClass()
        {
            Id = ObjectId.Parse(notification.AggregateId),
            Version = notification.Version,
            ClassIndex = notification.ClassIndex,
            CourseClassCode = notification.CourseClassCode,
            CourseClassName = notification.CourseClassName,
            CourseClassType = (CourseClassType)notification.CourseClassType,
            SubjectCode = notification.SubjectCode,
            SessionLength = notification.SessionLength,
            Session = notification.Session,
            CorrectionId = notification.CorrectionId,
            DurationInWeeks = notification.DurationInWeeks,
            MinDaySpaceLesson = notification.MinDaySpaceLesson,
            SemesterCode = notification.SemesterCode,
            NumberStudents = notification.NumberStudents,
            Stage = (SubjectTimelineStage)notification.Stage,
        }, cancellationToken);
    }
}