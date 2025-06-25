using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassBySemesterCodeSpec(string semesterCode) : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate =>
        courseClass => courseClass.SemesterCode == semesterCode && courseClass.Status == CourseClassStatus.Active;
}