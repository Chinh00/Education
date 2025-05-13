using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.Usecases.Specs;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetRegistersQuery : IListQuery<ListResultModel<RegisterState>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler : IRequestHandler<GetRegistersQuery, ResultModel<ListResultModel<RegisterState>>>
    {
        private readonly IMongoRepository<RegisterState> _repository;

        public Handler(IOptions<MongoOptions> mnOptions)
        {
            _repository = new MongoRepositoryBase<RegisterState>(new MongoClient(mnOptions.Value.ToString())
                .GetDatabase(mnOptions.Value.Database)
                .GetCollection<RegisterState>("RegisterSaga"));

        }

        public async Task<ResultModel<ListResultModel<RegisterState>>> Handle(GetRegistersQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetRegisterStatesSpec(request);
            var items = await _repository.FindAsync(spec, cancellationToken);
            var totalItems = await _repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<RegisterState>>.Create(
                ListResultModel<RegisterState>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }
}