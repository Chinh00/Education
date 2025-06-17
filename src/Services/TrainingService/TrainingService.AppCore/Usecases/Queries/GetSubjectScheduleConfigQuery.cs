using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetSubjectScheduleConfigQuery : IListQuery<ListResultModel<SubjectScheduleConfig>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    internal class Handler(IMongoRepository<SubjectScheduleConfig> repository)
        : IRequestHandler<GetSubjectScheduleConfigQuery, ResultModel<ListResultModel<SubjectScheduleConfig>>>
    {
        public async Task<ResultModel<ListResultModel<SubjectScheduleConfig>>> Handle(GetSubjectScheduleConfigQuery request,
            CancellationToken cancellationToken)
        {
            var spec = new GetSubjectScheduleConfigSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<SubjectScheduleConfig>>.Create(
                ListResultModel<SubjectScheduleConfig>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}