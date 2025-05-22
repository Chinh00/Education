using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using MongoDB.Bson;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public record GetStudentInformationQuery : IQuery<Student>
{
    internal class Handler(IMongoRepository<Student> repository, IClaimContextAccessor contextAccessor)
        : IRequestHandler<GetStudentInformationQuery, ResultModel<Student>>
    {

        public async Task<ResultModel<Student>> Handle(GetStudentInformationQuery request, CancellationToken cancellationToken)
        {
            var studentCode = contextAccessor.GetUsername();
            var spec = new GetStudentByCodeSpec(studentCode);
            var student = await repository.FindOneAsync(spec, cancellationToken);
            return ResultModel<Student>.Create(student);
        }
    }
}