using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.AppCore.Usecases.Queries;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStaffsSpec : ListSpecificationBase<Staff>
{
    public GetStaffsSpec(IListQuery<ListResultModel<Staff>> query)
    {
        ApplyFilters(query.Filters);;
        ApplyIncludes(query.Includes);
        ApplySorting(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.FullName);
        ApplyInclude(c => c.Code);
        ApplyInclude(c => c.DepartmentCode);
    }
    public GetStaffsSpec(IListQuery<ListResultModel<GetTeacherScheduleUsageQuery.TeacherScheduleUsageModel>> query)
    {
        ApplyFilters(query.Filters);;
        ApplyIncludes(query.Includes);
        ApplySorting(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.FullName);
        ApplyInclude(c => c.Code);
        ApplyInclude(c => c.DepartmentCode);
    }
    
}