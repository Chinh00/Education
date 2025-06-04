using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSemesterTreeSpec(string semesterCode) : SpecificationBase<Semester>
{
    public override Expression<Func<Semester, bool>> Predicate =>
        semester => semester.SemesterCode.Contains(semesterCode);
}