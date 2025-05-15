using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByCorrelationAndSubjectCodeAndClassIndexAndClassTypeIdSpec(
    Guid correlationId,
    string subjectCode,
    int classIndex,
    CourseClassType classType) : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate => @class =>
        @class.CorrectionId == correlationId && @class.SubjectCode == subjectCode && @class.ClassIndex == classIndex &&
        @class.CourseClassType == classType;
}