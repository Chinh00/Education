using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.Validation;
using FluentValidation;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateSemesterCommand(CreateSemesterCommand.CreateSemesterModel Model)
    : ICommand<IResult>
{
    public record struct CreateSemesterModel(
        string SemesterName,
        string SemesterCode,
        DateTime StartDate,
        DateTime EndDate,
        string ParentSemesterCode);
    public readonly record struct CreateSemesterAlready(string Message);
    
    
    
    
    internal class Handler(
        IMongoRepository<Semester> repository,
        IClaimContextAccessor claimContextAccessor,
        ITopicProducer<SemesterCreatedNotificationIntegrationEvent> producer)
        : IRequestHandler<CreateSemesterCommand, IResult>
    {
        public async Task<IResult> Handle(CreateSemesterCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var semester = await repository.AddAsync(new Semester()
            {
                SemesterName = request.Model.SemesterName,
                SemesterCode = request.Model.SemesterCode,
                StartDate = request.Model.StartDate,
                EndDate = request.Model.EndDate,
                ParentSemesterCode = request.Model.ParentSemesterCode ?? "",
            }, cancellationToken);

            if (semester.ParentSemesterCode != "")
            {
                await producer.Produce(new SemesterCreatedNotificationIntegrationEvent(new NotificationMessage()
                {
                    Recipients = [semester.ParentSemesterCode],
                    Roles = ["admin", "student", "department-admin"],
                    Title = "Học kỳ mới bắt đầu",
                    Content = $"Học kỳ mới với mã {semester.SemesterCode} đã được tạo bởi {userName} vào lúc {DateTime.UtcNow}.",
                }), cancellationToken);
            }
            
            
            
            
            return Results.Ok(ResultModel<Semester>.Create(semester));
        }
    }
}