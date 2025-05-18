using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByCorrelationIdSpec(Guid correlationId) : SpecificationBase<CourseClass>
{

    public override Expression<Func<CourseClass, bool>> Predicate => c => c.CorrectionId == correlationId; 
}