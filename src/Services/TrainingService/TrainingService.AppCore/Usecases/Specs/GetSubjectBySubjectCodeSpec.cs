using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectBySubjectCodeSpec(string subjectCode) : SpecificationBase<Subject>
{

    public override Expression<Func<Subject, bool>> Filter => c => c.SubjectCode == subjectCode;
}