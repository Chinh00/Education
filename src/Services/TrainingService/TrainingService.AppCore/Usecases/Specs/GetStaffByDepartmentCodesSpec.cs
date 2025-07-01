using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStaffByDepartmentCodesSpec(List<string> departmentCodes) : SpecificationBase<Staff>
{
    public override Expression<Func<Staff, bool>> Predicate => staff => departmentCodes.Contains(staff.DepartmentCode);
}