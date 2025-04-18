using System.Linq.Expressions;
using Education.Core.Specification;
using MongoDB.Bson;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.Specs;

public class GetStudentByUserIdSpec : SpecificationBase<Student>
{
    private readonly ObjectId _studentId;

    public GetStudentByUserIdSpec(ObjectId studentId)
    {
        _studentId = studentId;
    }

    public override Expression<Func<Student, bool>> Filter => x => x.Id == _studentId; 
}