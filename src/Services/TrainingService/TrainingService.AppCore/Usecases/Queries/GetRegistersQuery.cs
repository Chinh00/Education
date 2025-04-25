using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;

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
        private readonly IMongoCollection<RegisterState> _registers;

        public Handler(IOptions<MongoOptions> mnOptions)
        {
            _registers = new MongoClient(mnOptions.Value.ToString()).GetDatabase(mnOptions.Value.Database)
                .GetCollection<RegisterState>("RegisterSaga");;
        }

        public async Task<ResultModel<ListResultModel<RegisterState>>> Handle(GetRegistersQuery request, CancellationToken cancellationToken)
        {
            var registerStates = await _registers.Aggregate().ToListAsync(cancellationToken);;
            return ResultModel<ListResultModel<RegisterState>>.Create(
                ListResultModel<RegisterState>.Create(registerStates, 100, request.Page, request.PageSize));
        }
    }
}