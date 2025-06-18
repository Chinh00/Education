using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectScheduleConfigSubjectCodeSpec : SpecificationBase<SubjectScheduleConfig>
{
    private readonly string _semesterCode;
    private readonly string _code;
    private readonly List<SubjectTimelineStage> _stages;

    public GetSubjectScheduleConfigSubjectCodeSpec(string semesterCode, string code, List<SubjectTimelineStage> stages)
    {
        _semesterCode = semesterCode;
        _code = code;
        _stages = stages;
        ApplyInclude(e => e.Id);
    }
    public override Expression<Func<SubjectScheduleConfig, bool>> Predicate => x => x.SemesterCode == _semesterCode && x.SubjectCode == _code && _stages.Contains(x.Stage);
}