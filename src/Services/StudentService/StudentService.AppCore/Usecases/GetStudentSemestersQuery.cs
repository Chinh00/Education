using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public record GetStudentSemestersQuery : IListQuery<ListResultModel<StudentSemester>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    internal class Handler(IMongoRepository<StudentSemester> repository, IClaimContextAccessor contextAccessor)
        : IRequestHandler<GetStudentSemestersQuery, ResultModel<ListResultModel<StudentSemester>>>
    {
        public async Task<ResultModel<ListResultModel<StudentSemester>>> Handle(GetStudentSemestersQuery request, CancellationToken cancellationToken)
        {
            var studentCode = contextAccessor.GetUsername();
            var spec = new GetStudentSemestersAndStudentCodeSpec(request, studentCode);
            var items = await repository.FindAsync(spec, cancellationToken);
            var totalItems = await repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<StudentSemester>>.Create(
                ListResultModel<StudentSemester>.Create(items, totalItems, request.Page, request.PageSize)); 
        }
    }
}