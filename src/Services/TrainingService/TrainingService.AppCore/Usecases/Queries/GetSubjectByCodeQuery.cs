using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSubjectByCodeQuery : IItemQuery<string, Subject>
{
    public string Id { get; set; }

    internal class Handler(IMongoRepository<Subject> repository)
        : IRequestHandler<GetSubjectByCodeQuery, ResultModel<Subject>>
    {

        public async Task<ResultModel<Subject>> Handle(GetSubjectByCodeQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSubjectBySubjectCodeSpec(request.Id);
            var subject = await repository.FindOneAsync(spec, cancellationToken);
            return ResultModel<Subject>.Create(subject);
        }
    }
}