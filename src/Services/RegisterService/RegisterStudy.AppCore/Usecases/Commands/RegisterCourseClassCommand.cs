using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MassTransit;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record RegisterCourseClassCommand(RegisterCourseClassCommand.RegisterCourseClassModel Model) : ICommand<IResult>
{
    public record struct RegisterCourseClassModel(string SemesterCode, string SubjectCode, string CourseClassCode);
    internal class Handler(
        IRegisterRepository<CourseClass> repository,
        IRegisterRepository<StudentRegister> studentRegisterRepository,
        IClaimContextAccessor claimContextAccessor,
        ITopicProducer<RegisterCourseClassSucceedNotificationIntegrationEvent> topicProducer)
        : IRequestHandler<RegisterCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(RegisterCourseClassCommand request, CancellationToken cancellationToken)
        {
            var (semesterCode, subjectCode, courseClassCode) = request.Model;
            var studentCode = claimContextAccessor.GetUsername();
            
            var studentRegister = await studentRegisterRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) ?? new StudentRegister() 
            {
                StudentCode = studentCode,
                CourseClassCode = new List<string>()
            };
            var registered = studentRegister.CourseClassCode.Where(c => c.Contains(subjectCode)).ToList();
            studentRegister.CourseClassCode.RemoveAll(c => c.Contains(subjectCode));
            studentRegister.CourseClassCode.Add(courseClassCode);
            await studentRegisterRepository.SaveAsync(RedisKey.StudentRegisterCourseClass(studentCode),
                () => Task.FromResult(studentRegister));
            
            
            var courseClass = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, courseClassCode));
            courseClass.Students.Add(studentCode);
            await repository.SaveAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, courseClassCode),
                () => Task.FromResult(courseClass));
            foreach (var se in registered)
            {
                var courseClassRegistered = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se));
                courseClassRegistered.Students.Remove(subjectCode);
                await repository.SaveAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se),
                    () => Task.FromResult(courseClass));
            }
            
            await topicProducer.Produce(
                new RegisterCourseClassSucceedNotificationIntegrationEvent(
                    new NotificationMessage
                    {
                        Recipients = [studentCode],
                        Roles = ["student"], 
                        Title = "Đăng ký lớp học phần thành công",
                        Content = $"Chào {studentCode}, bạn đã đăng ký thành công lớp học phần \"{courseClassCode}\" (Mã: {courseClassCode}) vào lúc {DateTime.UtcNow}.",
                    }
                ),
                cancellationToken
            );
            return Results.Ok();
        }
    }
}