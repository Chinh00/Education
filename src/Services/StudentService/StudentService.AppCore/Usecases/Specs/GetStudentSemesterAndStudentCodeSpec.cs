using System.Linq.Expressions;
using Education.Core.Specification;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.Specs;

public class GetStudentSemesterAndStudentCodeSpec(string studentCode, string semesterCode)
    : SpecificationBase<StudentSemester>
{

    public override Expression<Func<StudentSemester, bool>> Predicate => semester => semester.StudentCode == studentCode && semester.SemesterCode == semesterCode;
}