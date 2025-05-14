using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStudentRegisterByCorrelationIdSpec : SpecificationBase<StudentRegister>
{
    private readonly Guid _correlationId;

    public GetStudentRegisterByCorrelationIdSpec(Guid correlationId)
    {
        _correlationId = correlationId;
    }

    public override Expression<Func<StudentRegister, bool>> Predicate => register => register.CorrelationId == _correlationId;
}