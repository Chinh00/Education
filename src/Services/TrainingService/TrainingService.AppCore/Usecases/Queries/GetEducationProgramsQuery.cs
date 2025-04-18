using Education.Core.Domain;
using Education.Core.Repository;
using FluentValidation;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetEducationProgramsQuery : IListQuery<ListResultModel<EducationProgram>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    public class Validator : AbstractValidator<GetEducationProgramsQuery>
    {
        public Validator()
        {
            
        }
    }
    
    internal class Handler : IRequestHandler<GetEducationProgramsQuery, ResultModel<ListResultModel<EducationProgram>>>
    {
        private readonly IMongoRepository<EducationProgram> _repository;

        public Handler(IMongoRepository<EducationProgram> repository)
        {
            _repository = repository;
        }

        public async Task<ResultModel<ListResultModel<EducationProgram>>> Handle(GetEducationProgramsQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetEducationProgramsSpec(request);
            var items = await _repository.FindAsync(spec, cancellationToken);
            var totalItems = await _repository.CountAsync(spec, cancellationToken);
            return ResultModel<ListResultModel<EducationProgram>>.Create(
                ListResultModel<EducationProgram>.Create(items, totalItems, request.Page, request.PageSize));
        }
    }



}