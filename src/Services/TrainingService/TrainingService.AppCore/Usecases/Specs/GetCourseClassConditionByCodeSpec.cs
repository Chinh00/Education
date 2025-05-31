using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassConditionByCodeSpec(string courseClassConditionCode)
    : SpecificationBase<CourseClassCondition>
{
    public override Expression<Func<CourseClassCondition, bool>> Predicate => condition => condition.ConditionCode ==  courseClassConditionCode;
}