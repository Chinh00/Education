using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectsSpec : ListSpecificationBase<Subject>
{
    public GetSubjectsSpec(IListQuery<ListResultModel<Subject>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.NumberOfCredits);
        ApplyInclude(c => c.SubjectCode);
        ApplyInclude(c => c.SubjectName);
        ApplyInclude(c => c.SubjectNameEng);
        ApplyInclude(c => c.SubjectDescription);
        ApplyInclude(c => c.DepartmentCode);
        ApplyInclude(c => c.DepartmentCode);
        ApplyInclude(c => c.Status);
        ApplyInclude(c => c.IsCalculateMark);
        
    }
}