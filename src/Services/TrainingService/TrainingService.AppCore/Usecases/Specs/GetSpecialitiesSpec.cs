using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSpecialitiesSpec : ListSpecification<Speciality>
{
    public GetSpecialitiesSpec(IListQuery<ListResultModel<Speciality>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.SpecialityCode);
        ApplyInclude(c => c.SpecialityName);
        ApplyInclude(c => c.SpecialityNameEng);
        ApplyInclude(c => c.DepartmentCode);
        ApplyInclude(c => c.SpecialityParentCode);
        ApplyInclude(c => c.Id);
    }
}