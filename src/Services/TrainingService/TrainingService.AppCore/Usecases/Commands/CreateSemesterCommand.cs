using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateSemesterCommand(string SemesterName, string SemesterCode, DateTime StartDate, DateTime EndDate) : ICommand<IResult>
{
    public readonly record struct CreateSemesterAlready(string Message);
    
    internal class Handler : IRequestHandler<CreateSemesterCommand, IResult>
    {
        private readonly IMongoRepository<Semester> _repository;

        public Handler(IMongoRepository<Semester> repository)
        {
            _repository = repository;
        }

        public async Task<IResult> Handle(CreateSemesterCommand request, CancellationToken cancellationToken)
        {
            var (semesterName, semesterCode, startDate, endDate) = request;
            var spec = new GetSemesterByCodeSpec(semesterCode);
            var semesterExit = await _repository.FindOneAsync(spec, cancellationToken);
            if (semesterExit is not null)
            {
                return Results.BadRequest(
                    ResultModel<CreateSemesterAlready>.Create(new CreateSemesterAlready("Kì học đã tồn tại")));
            }
            var semester = new Semester()
            {
                SemesterName = semesterName,
                SemesterCode = semesterCode,
                StartDate = startDate,
                EndDate = endDate
            };
            await _repository.AddAsync(semester, cancellationToken);
            return Results.Ok(ResultModel<Semester>.Create(semester));
        }
    }
}