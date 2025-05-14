using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectTimelineBySubjectCodesSpec : SpecificationBase<SubjectTimelineConfig>
{
    public GetSubjectTimelineBySubjectCodesSpec(IList<string> subjectCodes)
    {
        Predicate = c => subjectCodes.Contains(c.SubjectCode);
    }
    public override Expression<Func<SubjectTimelineConfig, bool>> Predicate { get; }
}