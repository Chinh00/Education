using Education.Core.Domain;
using MediatR;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetStaffsQuery : IListQuery<ListResultModel<Staff>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler : IRequestHandler<GetStaffsQuery, ResultModel<ListResultModel<Staff>>>
    {
        public Task<ResultModel<ListResultModel<Staff>>> Handle(GetStaffsQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}