using System.Text.Json;
using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
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
    IApplicationService<StudentSemester> semesterService,
    ITopicProducer<StudentPulledIntegrationEvent> producer)
    : INotificationHandler<StudentPullStartedDomainEvent>
{
    record ResultModelApi<T>(T Value, bool IsError, string Message);
    public async Task Handle(StudentPullStartedDomainEvent notification, CancellationToken cancellationToken)
    {
        var spec = new GetStudentByCodeSpec(notification?.StudentCode);
        var student = await repository.FindOneAsync(spec, cancellationToken) ?? new Student();
        var url = $"https://api5.tlu.edu.vn/api/Student/{notification?.StudentCode}/detail";
        var semesterUrl =
            $"https://api5.tlu.edu.vn/api/Student/Semester?Filters[0].field=StudentCode&Filters[0].comparison===&Includes=SubjectResults&Includes=CourseSubjects&Filters[0].value={notification?.StudentCode}";
        var response = await httpClient.GetAsync(url, cancellationToken);
        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = JsonSerializer.Deserialize<ResultModelApi<Student>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        student.CreateStudent(result?.Value?.PersonalInformation, result?.Value?.InformationBySchool, result?.Value?.EducationPrograms);
        var responseSemester = await httpClient.GetAsync(semesterUrl, cancellationToken);
        var jsonSemester = await responseSemester.Content.ReadAsStringAsync(cancellationToken);
        var resultSemester = JsonSerializer.Deserialize<ResultModelApi<ListResultModel<StudentSemester>>>(jsonSemester, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        await service.SaveEventStore(student, cancellationToken);
        foreach (var studentSemester in resultSemester.Value.Items)
        {
            var semester = new StudentSemester();
            semester.Create(notification?.StudentCode, studentSemester?.SemesterCode, studentSemester?.SemesterName,
                studentSemester.EducationStartDate, studentSemester.EducationEndDate,
                studentSemester.SubjectResults.ToList(), studentSemester.CourseSubjects.ToList());
            await semesterService.SaveEventStore(semester, cancellationToken);
        }
        await producer.Produce(new StudentPulledIntegrationEvent(notification?.StudentCode), cancellationToken);
    }
}