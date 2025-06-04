using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSemesterByCodeAndSemesterParentSpec(string code) : SpecificationBase<Semester>
{
    public override Expression<Func<Semester, bool>> Predicate => semester => semester.SemesterCode == code && semester.ParentSemesterCode == string.Empty;
}