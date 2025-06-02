using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using MediatR;
using MongoDB.Bson;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record UpdateCourseTeacherCommand(UpdateCourseTeacherCommand.UpdateCourseTeacherModel Model) : ICommand<IResult>
{
    public record struct UpdateCourseTeacherModel(string Id, string TeacherCode);
    internal class Handler(IApplicationService<CourseClass> service, IMongoRepository<Staff> staffRepository, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<UpdateCourseTeacherCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateCourseTeacherCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());

            var spec = new GetStaffByCodeSpec(request.Model.TeacherCode);
            var teacher = await staffRepository.FindOneAsync(spec, cancellationToken);
            var courseClass = await service.ReplayAggregate(ObjectId.Parse(request.Model.Id), cancellationToken);
            courseClass.AssignTeacher(teacher.Code, teacher.FullName, new Dictionary<string, object>()
            {
                { nameof(KeyMetadata.PerformedBy), userId },
                { nameof(KeyMetadata.PerformedByName), userName },
            });
            await service.SaveEventStore(courseClass, cancellationToken);
            return Results.Ok();
        }
    }
}