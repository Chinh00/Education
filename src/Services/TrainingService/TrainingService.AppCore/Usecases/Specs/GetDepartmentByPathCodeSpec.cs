using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetDepartmentByPathCodeSpec : SpecificationBase<Department>
{
    public GetDepartmentByPathCodeSpec(string pathCode)
    {
        Predicate = d => d.Path.Contains(pathCode);
    }
    public override Expression<Func<Department, bool>> Predicate { get; }
}