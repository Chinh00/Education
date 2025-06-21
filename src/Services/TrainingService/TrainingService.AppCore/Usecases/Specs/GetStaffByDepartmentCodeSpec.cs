using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStaffByDepartmentCodeSpec(string departmentCode) : SpecificationBase<Staff>
{
    public override Expression<Func<Staff, bool>> Predicate => staff => staff.DepartmentCode == departmentCode;
}