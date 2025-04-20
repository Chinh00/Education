using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetDepartmentsQuery : IListQuery<ListResultModel<Department>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Department> repository)
        : IRequestHandler<GetDepartmentsQuery, ResultModel<ListResultModel<Department>>>
    {

        public async Task<ResultModel<ListResultModel<Department>>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetDepartmentsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Department>>.Create(
                ListResultModel<Department>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}