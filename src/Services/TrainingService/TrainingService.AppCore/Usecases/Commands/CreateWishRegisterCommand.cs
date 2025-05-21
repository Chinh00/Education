using Education.Contract;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Validation;
using FluentValidation;
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
    DateTime EndDate) : ICommand<IResult>, IValidation
{
    public class Validator : AbstractValidator<CreateWishRegisterCommand>
    {
        public Validator()
        {
            RuleFor(c => c.MinCredit).GreaterThanOrEqualTo(0);
            RuleFor(c => c.MinCredit).LessThanOrEqualTo(100);
            RuleFor(c => c.SemesterCode).NotNull().NotEmpty();
            RuleFor(c => c.SemesterName).NotNull().NotEmpty();
            RuleFor(c => c.StartDate).NotNull().NotEmpty();
            RuleFor(c => c.EndDate).NotNull().NotEmpty();
        }
    }
    
    
    
    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        ITopicProducer<WishListCreated> topicProducer,
        IMongoRepository<Semester> semesterRepository,
        ISender sender)
        : IRequestHandler<CreateWishRegisterCommand, IResult>
    {
        public async Task<IResult> Handle(CreateWishRegisterCommand request, CancellationToken cancellationToken)
        {
            var semester =
                await semesterRepository.FindOneAsync(new GetSemesterByCodeSpec(request.SemesterCode),
                    cancellationToken);
            await sender.Send(new ChangeSemesterStatusCommand(semester.Id, SemesterStatus.Register), cancellationToken);
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