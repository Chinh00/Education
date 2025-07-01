using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetEducationProgramByEducationCodeSpec(string educationProgramCode) : SpecificationBase<EducationProgram>
{
    public override Expression<Func<EducationProgram, bool>> Predicate => c => c.Code == educationProgramCode;
}