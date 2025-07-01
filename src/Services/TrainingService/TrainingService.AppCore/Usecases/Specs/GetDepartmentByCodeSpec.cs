using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetDepartmentByCodeSpec : SpecificationBase<Department>
{
    public GetDepartmentByCodeSpec(string code)
    {
        Predicate = d => d.DepartmentCode == code;
    }
    public override Expression<Func<Department, bool>> Predicate { get; }
}