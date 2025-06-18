using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassBySemesterCodeAndListStageSpec(string semesterCode, List<int> stages)
    : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate =>
        courseClass => courseClass.SemesterCode == semesterCode && stages.Contains((int)courseClass.Stage);
}