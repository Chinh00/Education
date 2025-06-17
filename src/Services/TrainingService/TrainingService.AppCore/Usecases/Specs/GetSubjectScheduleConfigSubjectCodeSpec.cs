using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectScheduleConfigSubjectCodeSpec(string semesterCode, string code) : SpecificationBase<SubjectScheduleConfig>
{
    public override Expression<Func<SubjectScheduleConfig, bool>> Predicate => x => x.SemesterCode == semesterCode && x.SubjectCode == code;
}