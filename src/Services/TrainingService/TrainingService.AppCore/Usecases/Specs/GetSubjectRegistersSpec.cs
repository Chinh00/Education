using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectRegistersSpec : ListSpecificationBase<SubjectRegister> 
{
    public GetSubjectRegistersSpec(IListQuery<ListResultModel<SubjectRegister>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.StudentCodes);
        ApplyInclude(c => c.SubjectCode);
        ApplySortDesc(e => e.StudentCodes.Count);
    }
}