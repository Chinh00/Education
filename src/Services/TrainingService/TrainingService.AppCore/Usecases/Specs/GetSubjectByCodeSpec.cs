using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectByCodeSpec(string subjectCode) : SpecificationBase<Subject>
{

    public override Expression<Func<Subject, bool>> Predicate => subject => subject.SubjectCode == subjectCode;
}