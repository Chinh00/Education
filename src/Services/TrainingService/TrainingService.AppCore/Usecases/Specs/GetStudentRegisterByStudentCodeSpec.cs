using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStudentRegisterByStudentCodeSpec(string code) : SpecificationBase<StudentRegister>
{
    public override Expression<Func<StudentRegister, bool>> Filter => c => c.StudentCode == code;
}