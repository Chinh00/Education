using Education.Core.Domain;
using MediatR;
using System.Text.Json;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MassTransit;
using StudentService.AppCore.Usecases.Specs;
using StudentService.Domain;
using StudentService.Domain.Enums;

namespace StudentService.AppCore.Usecases;
record ResultModelApi<T>(T Data, bool IsError, string Message);
public record SyncStudentFromDataProviderQuery() : IQuery<bool>
{
    internal class Handler(
        IMongoRepository<Student> mongoRepository,
        IClaimContextAccessor claimContextAccessor,
        HttpClient httpClient,
        IMongoRepository<Student> repository,
        IMongoRepository<StudentSemester> semesterService,
        ITopicProducer<StudentPulledIntegrationEvent> producer)
        : IRequestHandler<SyncStudentFromDataProviderQuery, ResultModel<bool>>
    {
        public async Task<ResultModel<bool>> Handle(SyncStudentFromDataProviderQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor?.GetUsername();
            await SyncStudent(studentCode, cancellationToken);
            return ResultModel<bool>.Create(true);
        }

        async Task SyncStudent(string studentCode, CancellationToken cancellationToken)
        {
            var url = $"https://api5.tlu.edu.vn/api/Student/{studentCode}/detail";
            var semesterUrl =
                $"https://api5.tlu.edu.vn/api/Student/Semester?Filters[0].field=StudentCode&Filters[0].operator===&Includes=SubjectResults&Includes=CourseSubjects&Filters[0].value={studentCode}";
            var response = await httpClient.GetAsync(url, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<ResultModelApi<Student>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            await repository.AddAsync(result?.Data, cancellationToken);
            
            
            var responseSemester = await httpClient.GetAsync(semesterUrl, cancellationToken);
            var jsonSemester = await responseSemester.Content.ReadAsStringAsync(cancellationToken);
            var resultSemester = JsonSerializer.Deserialize<ResultModelApi<ListResultModel<StudentSemester>>>(jsonSemester, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            foreach (var studentSemester in resultSemester.Data.Items)
            {
                await semesterService.AddAsync(studentSemester, cancellationToken);
            }
            await producer.Produce(new StudentPulledIntegrationEvent(studentCode), cancellationToken);
        }
        
    }
}