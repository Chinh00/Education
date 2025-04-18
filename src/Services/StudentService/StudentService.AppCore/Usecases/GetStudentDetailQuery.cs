using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using FluentValidation;
using MassTransit;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases;

public record GetStudentDetailQuery(string StudentCode) : IQuery<Student>
{

    public class Validator : AbstractValidator<GetStudentDetailQuery>
    {
        public Validator()
        {
            
        }
    }
    
    
    internal class Handler(
        IMongoRepository<Student> repository,
        ITopicProducer<StudentCreatedIntegrationEvent> topicProducer)
        : IHandler<GetStudentDetailQuery, Student>
    {
        public async Task<ResultModel<Student>> Handle(GetStudentDetailQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetStudentByCodeSpec(request.StudentCode);   
            var student = await repository.FindOneAsync(spec, cancellationToken);
            await topicProducer.Produce(
                new { UserId = student.Id.ToString(), StudentCode = student.InformationBySchool.StudentCode },
                cancellationToken);
            return ResultModel<Student>.Create(student);
        }
    }
}