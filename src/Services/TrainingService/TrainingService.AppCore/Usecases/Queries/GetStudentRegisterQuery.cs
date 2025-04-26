using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetStudentRegisterQuery : IListQuery<ListResultModel<StudentRegister>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    
    internal class Handler(IMongoRepository<StudentRegister> repository)
        : IRequestHandler<GetStudentRegisterQuery, ResultModel<ListResultModel<StudentRegister>>>
    {

        public async Task<ResultModel<ListResultModel<StudentRegister>>> Handle(GetStudentRegisterQuery request, CancellationToken cancellationToken)
        {
            
            throw new NotImplementedException();
        }
    }

}