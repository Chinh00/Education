using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetEducationProgramsSpec : ListSpecificationBase<EducationProgram>
{
    public GetEducationProgramsSpec(IListQuery<ListResultModel<EducationProgram>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Name);
        ApplyInclude(c => c.Code);
        ApplyInclude(c => c.Type);
        ApplyInclude(c => c.TrainingTime);
        ApplyInclude(c => c.SpecialityCode);
        ApplyInclude(c => c.CourseCode);
    }
}