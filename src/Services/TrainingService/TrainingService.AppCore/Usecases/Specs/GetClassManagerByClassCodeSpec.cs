using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetClassManagerByClassCodeSpec(string classCode) : SpecificationBase<ClassManager>
{

    public override Expression<Func<ClassManager, bool>> Filter => c => c.ClassCode == classCode;
}