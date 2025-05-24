using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetRegistersQuery : IListQuery<ListResultModel<RegisterConfig>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<RegisterConfig> repository)
        : IRequestHandler<GetRegistersQuery, ResultModel<ListResultModel<RegisterConfig>>>
    {
        public async Task<ResultModel<ListResultModel<RegisterConfig>>> Handle(GetRegistersQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetRegisterConfigsSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<RegisterConfig>>.Create(
                ListResultModel<RegisterConfig>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}