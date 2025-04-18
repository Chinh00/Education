using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSemesterByCodeSpec : SpecificationBase<Semester>
{
    private readonly string _code;

    public GetSemesterByCodeSpec(string code)
    {
        _code = code;
    }

    public override Expression<Func<Semester, bool>> Filter => semester => semester.SemesterCode == _code;
}