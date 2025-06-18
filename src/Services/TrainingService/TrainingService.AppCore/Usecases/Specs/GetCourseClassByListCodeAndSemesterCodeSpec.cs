using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByListCodeAndSemesterCodeSpec(List<string> courseClassCodes, string semesterCode)
    : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate => x => courseClassCodes.Contains(x.CourseClassCode) && x.SemesterCode == semesterCode;
}