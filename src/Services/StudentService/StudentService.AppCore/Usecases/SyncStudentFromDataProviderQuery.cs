using Education.Core.Domain;
using MediatR;
using System.Text.Json;
using Education.Contract.DomainEvents;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MassTransit;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;
using StudentService.Domain.Enums;

namespace StudentService.AppCore.Usecases;

public record SyncStudentFromDataProviderQuery() : IQuery<bool>
{
    internal class Handler(
        IMongoRepository<Student> mongoRepository,
        IClaimContextAccessor claimContextAccessor,
        ITopicProducer<StudentPullStartedDomainEvent> producer)
        : IRequestHandler<SyncStudentFromDataProviderQuery, ResultModel<bool>>
    {
        public async Task<ResultModel<bool>> Handle(SyncStudentFromDataProviderQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor?.GetUsername();
            var spec = new GetStudentByCodeSpec(studentCode);
            var student = await mongoRepository.FindOneAsync(spec, cancellationToken) ?? new Student()
            {
                InformationBySchool = new InformationBySchool()
                {
                    StudentCode = studentCode
                }
            };
            student.ChangeStatus(StudentStatus.PullPending);      
            await mongoRepository.UpsertOneAsync(spec, student, cancellationToken);
            await producer.Produce(new { studentCode }, cancellationToken);
            return ResultModel<bool>.Create(true);
        }
    }
}