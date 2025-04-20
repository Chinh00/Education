using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetClassManagerByEducationCodeSpec(string educationCode)
    : SpecificationBase<ClassManager>
{

    public override Expression<Func<ClassManager, bool>> Filter => manager => manager.EducationCode == educationCode;
}