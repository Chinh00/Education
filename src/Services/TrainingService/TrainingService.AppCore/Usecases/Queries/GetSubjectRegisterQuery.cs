using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSubjectRegisterQuery : IListQuery<ListResultModel<SubjectRegister>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    
    internal class Handler(IMongoRepository<SubjectRegister> repository)
        : IRequestHandler<GetSubjectRegisterQuery, ResultModel<ListResultModel<SubjectRegister>>>
    {

        public async Task<ResultModel<ListResultModel<SubjectRegister>>> Handle(GetSubjectRegisterQuery request,
            CancellationToken cancellationToken)
        {
            var spec = new GetSubjectRegistersSpec(request);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<SubjectRegister>>.Create(
                ListResultModel<SubjectRegister>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }

}