using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Masstransits;

public class CourseClassLockedIntegrationEventHandler(IMongoRepository<CourseClass> courseClassRepository)
    : INotificationHandler<CourseClassLockedIntegrationEvent>
{
    public async Task Handle(CourseClassLockedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        foreach (var notificationClassLockedModel in notification.ClassLockedModels)
        {
            var spec = new GetCourseClassByCodeSpec(notificationClassLockedModel.CourseClassCode);
            var courseClass = await courseClassRepository.FindOneAsync(spec, cancellationToken);
            courseClass.StudentIds = notificationClassLockedModel.Students;
            await courseClassRepository.UpsertOneAsync(spec, courseClass, cancellationToken);
        }
    }
}