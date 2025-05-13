using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.AppCore.StateMachine;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetRegisterStatesSpec : ListSpecificationBase<RegisterState>
{
    public GetRegisterStatesSpec(IListQuery<ListResultModel<RegisterState>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.SemesterCode);
        ApplyInclude(c => c.CorrelationId);
        ApplyInclude(c => c.SemesterName);
        ApplyInclude(c => c.CurrentState);
        ApplyInclude(c => c.StartDate);
        ApplyInclude(c => c.EndDate);
        ApplyInclude(c => c.MinCredit);
        ApplyInclude(c => c.MaxCredit);
    }
    
}