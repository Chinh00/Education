
using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetClassManagerQuery : IListQuery<ListResultModel<ClassManager>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler : IRequestHandler<GetClassManagerQuery, ResultModel<ListResultModel<ClassManager>>>
    {
        private readonly IMongoRepository<ClassManager> _classManagerRepository;
        public Handler(IMongoRepository<ClassManager> classManagerRepository)
        {
            _classManagerRepository = classManagerRepository;
        }

        public async Task<ResultModel<ListResultModel<ClassManager>>> Handle(GetClassManagerQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetClassManagersSpec(request);
            var items = await _classManagerRepository.FindAsync(spec, cancellationToken);
            var total = await _classManagerRepository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<ClassManager>>.Create(
                ListResultModel<ClassManager>.Create(items, total, request.Page, request.PageSize));
        }
    }
}