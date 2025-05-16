using Education.Contract;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateWishRegisterCommand(
    int MinCredit,
    int MaxCredit,
    string SemesterCode,
    string SemesterName,
    DateTime StartDate,
    DateTime EndDate) : ICommand<IResult>
{

    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        IMongoRepository<ClassManager> mongoRepository,
        IMongoRepository<EducationProgram> educationProgramRepository,
        ITopicProducer<WishListCreated> topicProducer,
        IMongoRepository<Semester> semesterRepository)
        : IRequestHandler<CreateWishRegisterCommand, IResult>
    {
        public async Task<IResult> Handle(CreateWishRegisterCommand request, CancellationToken cancellationToken)
        {
            var semester =
                await semesterRepository.FindOneAsync(new GetSemesterByCodeSpec(request.SemesterCode),
                    cancellationToken);
            semester.SemesterStatus = SemesterStatus.Register;
            await semesterRepository.UpsertOneAsync(new GetSemesterByCodeSpec(request.SemesterCode), semester,
                cancellationToken);
            await topicProducer.Produce(new
            {
                CorrelationId = Guid.NewGuid(),
                request.MinCredit,
                request.MaxCredit,
                request.StartDate,
                request.EndDate,
                request.SemesterCode,
                request.SemesterName,
            }, cancellationToken);
            return Results.Created();
        }
    }
}