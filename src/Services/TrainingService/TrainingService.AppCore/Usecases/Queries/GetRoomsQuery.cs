using Education.Core.Domain;
using MediatR;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetRoomsQuery : IListQuery<ListResultModel<Room>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler : IRequestHandler<GetRoomsQuery, ResultModel<ListResultModel<Room>>>
    {
        public async Task<ResultModel<ListResultModel<Room>>> Handle(GetRoomsQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
    
}