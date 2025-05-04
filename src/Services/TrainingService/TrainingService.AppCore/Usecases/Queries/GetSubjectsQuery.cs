using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSubjectsQuery : IListQuery<ListResultModel<Subject>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Subject> repository)
        : IRequestHandler<GetSubjectsQuery, ResultModel<ListResultModel<Subject>>>
    {
        public async Task<ResultModel<ListResultModel<Subject>>> Handle(GetSubjectsQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSubjectsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Subject>>.Create(
                ListResultModel<Subject>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}