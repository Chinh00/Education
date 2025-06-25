using Education.Contract.IntegrationEvents;
using MassTransit;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class CourseClassLockHandler(
    IRegisterRepository<CourseClass> registerRepository,
    IRegisterRepository<StudentRegister> studentRegisterRepository,
    ITopicProducer<CourseClassLockedIntegrationEvent> producer,
    ITopicProducer<StudentCourseClassLockedIntegrationEvent> studentProducer)
{
    public async Task Handle(string semesterCode, CancellationToken cancellationToken)
    {
        var studentRegisterKeys = (await registerRepository.GetKeysAsync(RedisKey.StudentRegisterCourseClass("*"))).ToList();

        var studentRegisterDataList = new List<StudentRegister>();
        foreach (var studentRegister in studentRegisterKeys)
        {
            var studentRegisterData = await studentRegisterRepository.GetAsync(studentRegister);
            if (studentRegisterData == null) continue;
            studentRegisterDataList.Add(studentRegisterData);

            await studentProducer.Produce(
                new StudentCourseClassLockedIntegrationEvent(
                    studentRegisterData.StudentCode, 
                    "1_2024_2025", 
                    studentRegisterData.CourseClassCode
                ),
                cancellationToken);
        }

        var grouped = studentRegisterDataList
            .SelectMany(sr => sr.CourseClassCode.Select(ccc => new { CourseClassCode = ccc, sr.StudentCode }))
            .GroupBy(x => x.CourseClassCode)
            .Select(g => new CourseClassLockedModel(
                g.Key,
                g.Select(x => x.StudentCode).Distinct().ToList()
            ))
            .ToList();

        await producer.Produce(
            new CourseClassLockedIntegrationEvent(grouped),
            cancellationToken
        );
    }
}