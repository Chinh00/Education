using Education.Contract;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using Education.Infrastructure.Validation;
using FluentValidation;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateRegisterConfigCommand(
    int MinCredit,
    int MaxCredit,
    string SemesterCode,
    DateTime WishStartDate,
    DateTime WishEndDate
    ) : ICommand<IResult>, IValidation
{
    public class Validator : AbstractValidator<CreateRegisterConfigCommand>
    {
        public Validator()
        {
            RuleFor(c => c.MinCredit).GreaterThanOrEqualTo(0);
            RuleFor(c => c.MinCredit).LessThanOrEqualTo(100);
            RuleFor(c => c.SemesterCode).NotNull().NotEmpty();
            RuleFor(c => c.WishStartDate).NotNull().NotEmpty();
            RuleFor(c => c.WishEndDate).NotNull().NotEmpty();
        }
    }
    
    
    
    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<Semester> semesterRepository,
        IApplicationService<RegisterConfig> application)
        : IRequestHandler<CreateRegisterConfigCommand, IResult>
    {
        public async Task<IResult> Handle(CreateRegisterConfigCommand request, CancellationToken cancellationToken)
        {
            var (minCredit, maxCredit, semesterCode, startDate, endDate) = request;
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var semester =
                await semesterRepository.FindOneAsync(new GetSemesterByCodeSpec(request.SemesterCode),
                    cancellationToken);
            semester.SemesterStatus = SemesterStatus.Register;
            await semesterRepository.UpsertOneAsync(new GetSemesterByCodeSpec(request.SemesterCode), semester, cancellationToken);
            var registerConfig = new RegisterConfig();
            registerConfig.Create(semesterCode, startDate, endDate, minCredit, maxCredit, new Dictionary<string, object>()
            {
                {nameof(KeyMetadata.PerformedBy), userId},
                {nameof(KeyMetadata.PerformedByName), userName},
            });
            await application.SaveEventStore(registerConfig, cancellationToken);
            return Results.Created();
        }
    }
}