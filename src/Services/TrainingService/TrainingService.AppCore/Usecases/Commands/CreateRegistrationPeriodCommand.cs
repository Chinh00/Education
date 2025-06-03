using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateRegistrationPeriodCommand(CreateRegistrationPeriodCommand.CreateRegistrationPeriodModel Model)
    : ICommand<IResult>
{
    public record struct CreateRegistrationPeriodModel(
        string RegisterId,
        DateTime StudentRegistrationStartDate,
        DateTime StudentRegistrationEndDate
    );
    
    
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IApplicationService<RegisterConfig> registerConfigService,
        IMongoRepository<RegisterConfig> registerConfigRepository)
        : IRequestHandler<CreateRegistrationPeriodCommand, IResult>
    {
        public async Task<IResult> Handle(CreateRegistrationPeriodCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var registerConfig =
                await registerConfigService.ReplayAggregate(ObjectId.Parse(request.Model.RegisterId),
                    cancellationToken);
            registerConfig.UpdateStudentRegisterPeriod(
                request.Model.StudentRegistrationStartDate,
                request.Model.StudentRegistrationEndDate,
                new Dictionary<string, object>()
                {
                    { "UserId", userId },
                    { "UserName", userName }
                });
            await registerConfigService.SaveEventStore(registerConfig, cancellationToken);
            return Results.Ok(new
            {
                Message = "Cập nhật thời gian đăng ký thành công",
            });
        }
    }
}