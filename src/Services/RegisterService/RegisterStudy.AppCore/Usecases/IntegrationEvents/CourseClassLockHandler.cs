using Education.Contract.IntegrationEvents;
using MassTransit;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class CourseClassLockHandler(IRegisterRepository<CourseClass> registerRepository, ITopicProducer<CourseClassLockedIntegrationEvent> producer)
{
    public async Task Handle(string semesterCode, CancellationToken cancellationToken)
    {
        var key = RedisKey.SubjectCourseClass(semesterCode, "*", "*");
        var courseClass = await registerRepository.GetKeysAsync(key);
        var listCourseClass = new List<CourseClassLockedModel>();
        foreach (var c in courseClass)
        {
            var courseClassData = await registerRepository.GetAsync(c);
            listCourseClass.Add(new CourseClassLockedModel(
                courseClassData.CourseClassCode,
                courseClassData.Students.ToList()
            ));
        }
        var res = await GetStudentSubjects(semesterCode);
        // await producer.Produce(new CourseClassLockedIntegrationEvent(listCourseClass), cancellationToken);
    }
    public async Task<Dictionary<string, List<string>>> GetStudentSubjects(string semesterCode)
    {
        var key = RedisKey.SubjectCourseClass(semesterCode, "*", "*");
        var courseClassKeys = await registerRepository.GetKeysAsync(key);
        var studentSubjects = new Dictionary<string, List<string>>();

        foreach (var c in courseClassKeys)
        {
            var courseClass = await registerRepository.GetAsync(c);
            foreach (var studentCode in courseClass.Students)
            {
                if (!studentSubjects.ContainsKey(studentCode))
                    studentSubjects[studentCode] = new List<string>();

                // Tránh thêm trùng môn nếu sinh viên đăng ký nhiều lớp cùng môn
                if (!studentSubjects[studentCode].Contains(courseClass.SubjectCode))
                    studentSubjects[studentCode].Add(courseClass.SubjectCode);
            }
        }

        return studentSubjects;
    }
}