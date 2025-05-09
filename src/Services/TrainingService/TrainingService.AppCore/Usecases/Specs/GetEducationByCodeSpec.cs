using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetEducationByCodeSpec : SpecificationBase<EducationProgram>
{
    private readonly string _educationCode;

    public GetEducationByCodeSpec(string educationCode)
    {
        _educationCode = educationCode;
    }

    public override Expression<Func<EducationProgram, bool>> Predicate => c => c.Code == _educationCode;
}