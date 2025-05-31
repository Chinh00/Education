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
//
// public string SemesterCode { get; set; } = null!;
// public string SemesterName { get; set; } = null!;
// public DateTime StartDate { get; set; }
// public DateTime EndDate { get; set; }
// [Description("Thời gian sinh viên thay đổi")]
// public DateTime StudentChangeStart { get; set; } 
// public DateTime StudentChangeEnd { get; set; } 
//     
// [Description("Thời gian bắt đầu học")]
// public DateTime EducationStart { get; set; }
// public DateTime EducationEnd { get; set; }
//     
// public int MinCredit { get; set; }
// public int MaxCredit { get; set; }

public record CreateRegisterConfigCommand(
    int MinCredit,
    int MaxCredit,
    string SemesterCode,
    DateTime StartDate,
    DateTime EndDate,
    DateTime StudentChangeStart,
    DateTime StudentChangeEnd,
    DateTime EducationStart,
    DateTime EducationEnd
    ) : ICommand<IResult>, IValidation
{
    public class Validator : AbstractValidator<CreateRegisterConfigCommand>
    {
        public Validator()
        {
            RuleFor(c => c.MinCredit).GreaterThanOrEqualTo(0);
            RuleFor(c => c.MinCredit).LessThanOrEqualTo(100);
            RuleFor(c => c.SemesterCode).NotNull().NotEmpty();
            RuleFor(c => c.StartDate).NotNull().NotEmpty();
            RuleFor(c => c.EndDate).NotNull().NotEmpty();
        }
    }
    
    
    
    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<Semester> semesterRepository,
        IApplicationService<RegisterConfig> application,
        ISender sender)
        : IRequestHandler<CreateRegisterConfigCommand, IResult>
    {
        public async Task<IResult> Handle(CreateRegisterConfigCommand request, CancellationToken cancellationToken)
        {
            var (minCredit, maxCredit, semesterCode, startDate, endDate, studentChangeStart, studentChangeEnd, educationStart, educationEnd) = request;
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var semester =
                await semesterRepository.FindOneAsync(new GetSemesterByCodeSpec(request.SemesterCode),
                    cancellationToken);
            await sender.Send(new ChangeSemesterStatusCommand(semester.Id, SemesterStatus.Register), cancellationToken);
            var registerConfig = new RegisterConfig();
            registerConfig.Create(semesterCode, startDate, endDate, studentChangeStart, studentChangeEnd, educationStart, educationEnd, minCredit, maxCredit, new Dictionary<string, object>()
            {
                {nameof(KeyMetadata.PerformedBy), userId},
                {nameof(KeyMetadata.PerformedByName), userName},
            });
            await application.SaveEventStore(registerConfig, cancellationToken);
            return Results.Created();
        }
    }
}