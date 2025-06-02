using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByCodeSpec(string courseClassCode) : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate =>  x => x.CourseClassCode == courseClassCode;
}