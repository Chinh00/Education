using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using Education.Infrastructure.Validation;
using FluentValidation;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateSemesterCommand(string SemesterName, string SemesterCode, DateTime StartDate, DateTime EndDate)
    : ICommand<IResult>, IValidation
{
    public readonly record struct CreateSemesterAlready(string Message);
    
    public class Validator : AbstractValidator<CreateSemesterCommand>
    {
        public Validator()
        {
            RuleFor(c => c.SemesterName).NotNull().NotEmpty();
            RuleFor(c => c.SemesterCode).NotNull().NotEmpty();
            RuleFor(c => c.StartDate).NotNull().NotEmpty();
            RuleFor(c => c.EndDate).NotNull().NotEmpty();
        }
    }
    
    
    internal class Handler(
        IMongoRepository<Semester> repository,
        IApplicationService<Semester> application,
        IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<CreateSemesterCommand, IResult>
    {
        public async Task<IResult> Handle(CreateSemesterCommand request, CancellationToken cancellationToken)
        {
            var (semesterName, semesterCode, startDate, endDate) = request;
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            
            
            var spec = new GetSemesterByCodeSpec(semesterCode);
            var semesterExit = await repository.FindOneAsync(spec, cancellationToken);
            if (semesterExit is not null)
            {
                return Results.BadRequest(
                    ResultModel<CreateSemesterAlready>.Create(new CreateSemesterAlready("Kì học đã tồn tại")));
            }
            
            
            var semester = new Semester();
            semester.CreateSemester(semesterName, semesterCode, startDate, endDate, new Dictionary<string, object>()
            {
                {nameof(KeyMetadata.PerformedBy), userId},
                {nameof(KeyMetadata.PerformedByName), userName},
            });
            await application.SaveEventStore(semester, cancellationToken);
            return Results.Ok(ResultModel<Semester>.Create(semester));
        }
    }
}