using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetCourseClassesQuery : IListQuery<ListResultModel<CourseClass>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<CourseClass> repository)
        : IRequestHandler<GetCourseClassesQuery, ResultModel<ListResultModel<CourseClass>>>
    {
        public async Task<ResultModel<ListResultModel<CourseClass>>> Handle(GetCourseClassesQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetCourseClassesSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<CourseClass>>.Create(
                ListResultModel<CourseClass>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}