using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetCourseClassConditionQuery : IListQuery<ListResultModel<CourseClassCondition>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<CourseClassCondition> repository)
        : IRequestHandler<GetCourseClassConditionQuery, ResultModel<ListResultModel<CourseClassCondition>>>
    {
        public async Task<ResultModel<ListResultModel<CourseClassCondition>>> Handle(GetCourseClassConditionQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetCourseClassConditionsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<CourseClassCondition>>.Create(
                ListResultModel<CourseClassCondition>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}