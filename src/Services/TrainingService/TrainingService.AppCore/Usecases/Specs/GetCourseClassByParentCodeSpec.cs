using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByParentCodeSpec(string parentCode) : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate => @class => @class.ParentCourseClassCode == parentCode;
}