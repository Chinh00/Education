using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetStaffsQuery : IListQuery<ListResultModel<Staff>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Staff> repository)
        : IRequestHandler<GetStaffsQuery, ResultModel<ListResultModel<Staff>>>
    {
        public async Task<ResultModel<ListResultModel<Staff>>> Handle(GetStaffsQuery request,
            CancellationToken cancellationToken)
        {
            var spec = new GetStaffsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Staff>>.Create(
                ListResultModel<Staff>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}