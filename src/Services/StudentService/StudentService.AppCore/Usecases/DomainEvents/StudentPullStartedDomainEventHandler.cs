using System.Text.Json;
using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Core.Services;
using MassTransit;
using MediatR;
using StudentService.AppCore.Usecases.IntegrationEvents;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;
using StudentService.Domain.Enums;

namespace StudentService.AppCore.Usecases.DomainEvents;

public class StudentPullStartedDomainEventHandler(
    HttpClient httpClient,
    IMongoRepository<Student> repository,
    IApplicationService<Student> service,
    ITopicProducer<StudentPulledIntegrationEvent> producer)
    : INotificationHandler<StudentPullStartedDomainEvent>
{
    record ResultModelApi<T>(T Value, bool IsError, string Message);
    public async Task Handle(StudentPullStartedDomainEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetStudentByCodeSpec(notification?.StudentCode);
        var student = await repository.FindOneAsync(spec, cancellationToken) ?? new Student();
        var url = $"https://api5.tlu.edu.vn/api/Student/{notification?.StudentCode}/detail";
        var response = await httpClient.GetAsync(url, cancellationToken);
        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = JsonSerializer.Deserialize<ResultModelApi<Student>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        student.CreateStudent(result?.Value?.PersonalInformation, result?.Value?.InformationBySchool, result?.Value?.EducationPrograms);
        student.ChangeStatus(StudentStatus.Active);
        await service.SaveEventStore(student, cancellationToken);
        await producer.Produce(new { UserName = notification?.StudentCode }, cancellationToken);
    }
}