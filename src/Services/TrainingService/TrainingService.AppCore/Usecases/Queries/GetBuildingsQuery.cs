using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetBuildingsQuery : IListQuery<ListResultModel<Building>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Building> repository)
        : IRequestHandler<GetBuildingsQuery, ResultModel<ListResultModel<Building>>>
    {
        public async Task<ResultModel<ListResultModel<Building>>> Handle(GetBuildingsQuery request,
            CancellationToken cancellationToken)
        {
            var spec = new GetBuildingsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Building>>.Create(
                ListResultModel<Building>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}