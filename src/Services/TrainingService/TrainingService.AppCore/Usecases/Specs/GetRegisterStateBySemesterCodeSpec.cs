using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.AppCore.StateMachine;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetRegisterStateBySemesterCodeSpec(string semesterCode) : SpecificationBase<RegisterState>
{
    public override Expression<Func<RegisterState, bool>> Predicate => state => state.SemesterCode == semesterCode;
}