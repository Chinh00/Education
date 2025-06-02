using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStaffByCodeSpec(string teacherCode) : SpecificationBase<Staff>
{
    public override Expression<Func<Staff, bool>> Predicate => staff => staff.Code ==  teacherCode;
}