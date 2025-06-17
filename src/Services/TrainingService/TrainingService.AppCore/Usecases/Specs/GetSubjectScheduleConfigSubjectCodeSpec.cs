using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectScheduleConfigSubjectCodeSpec(string semesterCode, string code, List<SubjectTimelineStage> stages) : SpecificationBase<SubjectScheduleConfig>
{
    public override Expression<Func<SubjectScheduleConfig, bool>> Predicate => x => x.SemesterCode == semesterCode && x.SubjectCode == code && stages.Contains(x.Stage);
}