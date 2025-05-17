using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByCorrelationIdSpec(Guid correlationId) : SpecificationBase<CourseClass>
{
    private readonly Guid _correlationId = correlationId;

    public override Expression<Func<CourseClass, bool>> Predicate => c => c.CorrectionId == _correlationId; 
}