using Education.Core.Domain;
using Education.Core.Repository;
using FluentValidation;
using MediatR;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public record GetStudentsQuery : IListQuery<ListResultModel<Student>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    public class Validator : AbstractValidator<GetStudentsQuery>
    {
        public Validator()
        {
            
        }
    }
    
    internal class Handler(IMongoRepository<Student> repository)
        : IRequestHandler<GetStudentsQuery, ResultModel<ListResultModel<Student>>>
    {
        public async Task<ResultModel<ListResultModel<Student>>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetStudentsSpec(request);
            var totalItems = await repository.FindAsync(spec, cancellationToken);
            var totalCount = await repository.CountAsync(spec, cancellationToken);
            var listResult = ListResultModel<Student>.Create(totalItems, totalCount, request.Page, request.PageSize);
            return ResultModel<ListResultModel<Student>>.Create(listResult);
        }
    }
}