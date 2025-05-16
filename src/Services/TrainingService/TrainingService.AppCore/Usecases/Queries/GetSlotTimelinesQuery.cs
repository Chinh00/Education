using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetSlotTimelinesQuery : IListQuery<ListResultModel<SlotTimeline>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<SlotTimeline> repository)
        : IRequestHandler<GetSlotTimelinesQuery, ResultModel<ListResultModel<SlotTimeline>>>
    {
        public async Task<ResultModel<ListResultModel<SlotTimeline>>> Handle(GetSlotTimelinesQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSlotTimelinesSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<SlotTimeline>>.Create(
                ListResultModel<SlotTimeline>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}