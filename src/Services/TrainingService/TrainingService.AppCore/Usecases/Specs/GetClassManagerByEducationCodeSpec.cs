using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetClassManagerByEducationCodeSpec : SpecificationBase<ClassManager>
{
    private readonly string _educationCode;

    public GetClassManagerByEducationCodeSpec(string educationCode)
    {
        _educationCode = educationCode;
    }

    public override Expression<Func<ClassManager, bool>> Predicate => c => c.EducationCode == _educationCode;
}