using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSpecialitiesQuery : IListQuery<ListResultModel<Speciality>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    internal class Handler(IMongoRepository<Speciality> repository)
        : IRequestHandler<GetSpecialitiesQuery, ResultModel<ListResultModel<Speciality>>>
    {
        public async Task<ResultModel<ListResultModel<Speciality>>> Handle(GetSpecialitiesQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSpecialitiesSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<Speciality>>.Create(
                ListResultModel<Speciality>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}