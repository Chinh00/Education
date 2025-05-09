using System.Linq.Expressions;
using Education.Core.Specification;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.Specs;

public class GetStudentByCodeSpec : SpecificationBase<Student>
{
    private readonly string _studentCode;

    public GetStudentByCodeSpec(string studentCode)
    {
        _studentCode = studentCode;
    }

    public override Expression<Func<Student, bool>> Predicate => c => c.InformationBySchool.StudentCode == _studentCode;
}