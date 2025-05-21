using Education.Core.Domain;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record ChangeSemesterStatusCommand(ObjectId Id, SemesterStatus SemesterStatus) : ICommand<IResult>
{
    internal class Handler(IApplicationService<Semester> service, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<ChangeSemesterStatusCommand, IResult>
    {
        public async Task<IResult> Handle(ChangeSemesterStatusCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var semester = await service.ReplayAggregate(request.Id, cancellationToken);
            semester.ChangeSemesterStatus(request.SemesterStatus, new Dictionary<string, object>()
            {
                { nameof(KeyMetadata.PerformedBy), userId },
                { nameof(KeyMetadata.PerformedByName), userName }
            });
            await service.SaveEventStore(semester, cancellationToken);
            return Results.Ok();
        }
    }
}