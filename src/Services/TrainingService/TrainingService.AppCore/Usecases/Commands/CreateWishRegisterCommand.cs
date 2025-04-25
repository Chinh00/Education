using Education.Contract;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateWishRegisterCommand(
    string WishRegisterName,
    string WishRegisterCode,
    string SemesterCode,
    DateTime StartDate,
    DateTime EndDate) : ICommand<IResult>
{

    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        IMongoRepository<ClassManager> mongoRepository,
        IMongoRepository<EducationProgram> educationProgramRepository,
        ITopicProducer<WishListCreated> topicProducer)
        : IRequestHandler<CreateWishRegisterCommand, IResult>
    {
        public async Task<IResult> Handle(CreateWishRegisterCommand request, CancellationToken cancellationToken)
        {
            await topicProducer.Produce(new
            {
                CorrelationId = Guid.NewGuid(),
                request.WishRegisterName,
                request.WishRegisterCode,
                request.StartDate,
                request.EndDate,
            }, cancellationToken);
            return Results.Created();
        }
    }
}