using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectScheduleConfigSubjectCodeSpec(string semesterCode, string code, SubjectTimelineStage stage) : SpecificationBase<SubjectScheduleConfig>
{
    public override Expression<Func<SubjectScheduleConfig, bool>> Predicate => x => x.SemesterCode == semesterCode && x.SubjectCode == code && x.Stage == stage;
}