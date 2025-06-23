using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStaffByListCodeSpec : SpecificationBase<Staff>
{
    public GetStaffByListCodeSpec(List<string> staffCodes)
    {
        Predicate = staff => staffCodes.Contains(staff.Code);
    }
    public override Expression<Func<Staff, bool>> Predicate { get; }
}