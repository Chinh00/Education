using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetRoomsQuery : IListQuery<ListResultModel<Room>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<Room> repository)
        : IRequestHandler<GetRoomsQuery, ResultModel<ListResultModel<Room>>>
    {
        public async Task<ResultModel<ListResultModel<Room>>> Handle(GetRoomsQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetRoomsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Room>>.Create(
                ListResultModel<Room>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
    
}