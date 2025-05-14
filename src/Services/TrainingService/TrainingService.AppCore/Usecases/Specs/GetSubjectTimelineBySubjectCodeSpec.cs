using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectTimelineBySubjectCodeSpec(string subjectCode) : SpecificationBase<SubjectTimelineConfig>
{
    private readonly string _subjectCode = subjectCode;

    public override Expression<Func<SubjectTimelineConfig, bool>> Predicate => c => c.SubjectCode == _subjectCode;
}