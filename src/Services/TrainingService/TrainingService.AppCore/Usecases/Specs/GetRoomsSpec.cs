using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetRoomsSpec : ListSpecificationBase<Room>
{
    public GetRoomsSpec(IListQuery<ListResultModel<Room>> query)
    {
        ApplyFilters(query.Filters);;
        ApplyIncludes(query.Includes);
        ApplySorting(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.BuildingCode);
        ApplyInclude(c => c.Code);
        ApplyInclude(c => c.Name);
        ApplyInclude(c => c.Capacity);
        ApplyInclude(c => c.ExamCapacity);
    }
}