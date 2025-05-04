using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStudentRegisterByStudentCodeAndEducationCodeSpec(string educationCode, string studentCode)
    : SpecificationBase<StudentRegister>
{
    public override Expression<Func<StudentRegister, bool>> Filter =>
        c => c.StudentCode == studentCode && c.EducationCode == educationCode;
}