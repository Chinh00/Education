using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetBuildingsSpec : ListSpecificationBase<Building>
{
    public GetBuildingsSpec(IListQuery<ListResultModel<Building>> query)
    {
        ApplyFilters(query.Filters);;
        ApplyIncludes(query.Includes);
        ApplySorting(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.BuildingCode);
        ApplyInclude(c => c.Location);
        ApplyInclude(c => c.Name);
    }
}