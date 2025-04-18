using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSemestersQuery : IListQuery<ListResultModel<Semester>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    internal class Handler(IMongoRepository<Semester> repository)
        : IRequestHandler<GetSemestersQuery, ResultModel<ListResultModel<Semester>>>
    {

        public async Task<ResultModel<ListResultModel<Semester>>> Handle(GetSemestersQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSemestersSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Semester>>.Create(
                ListResultModel<Semester>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
    
    
}