using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetCoursesQuery : IListQuery<ListResultModel<Course>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    internal class Handler(IMongoRepository<Course> repository)
        : IRequestHandler<GetCoursesQuery, ResultModel<ListResultModel<Course>>>
    {

        public async Task<ResultModel<ListResultModel<Course>>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetCoursesSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Course>>.Create(
                ListResultModel<Course>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}