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

            // Lấy thông tin course class
            var courseClassKey = RedisKey.SubjectCourseClass(semesterCode, subjectCode, courseClassCode);
            var courseClass = await repository.GetAsync(courseClassKey);

            if (courseClass == null)
            {
                return Results.BadRequest($"Không tìm thấy lớp học phần {courseClassCode}.");
            }

            // Đảm bảo danh sách sinh viên không null
            courseClass.Students ??= new List<string>();

            // Kiểm tra đã đăng ký chưa
            if (courseClass.Students.Contains(studentCode))
            {
                return Results.BadRequest("Bạn đã đăng ký lớp học phần này.");
            }

            // Kiểm tra số lượng sinh viên đã tối đa chưa
            if (courseClass.Students.Count >= courseClass.NumberStudentsExpected)
            {
                return Results.BadRequest("Lớp học phần đã đủ số lượng sinh viên.");
            }

            // Thêm sinh viên vào danh sách lớp học phần
            courseClass.Students.Add(studentCode);

            // Lưu lại CourseClass (cập nhật danh sách sinh viên)
            await repository.SaveAsync(courseClassKey, () => Task.FromResult(courseClass));

            // Lấy thông tin đăng ký hiện tại hoặc tạo mới
            var studentRegister = await studentRegisterRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) 
                ?? new StudentRegister()
                {
                    StudentCode = studentCode,
                    CourseClassCode = new List<string>() // dạng ["subjectCode:courseClassCode"]
                };
            // Xóa đăng ký cũ của môn này (nếu có)
            var enumerable = studentRegister.CourseClassCode.Where(s => s.Contains($"{subjectCode}:")); 
            foreach (var se in enumerable)
            {
                var cc = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se));
                cc.Students.Remove(studentCode);
                await repository.SaveAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se), () => Task.FromResult(cc));
            }
            studentRegister.CourseClassCode.RemoveAll(c => c.Contains($"{subjectCode}"));


            // Thêm đăng ký mới cho môn này
            studentRegister.CourseClassCode.Add(courseClassCode);

            // Lưu lại thông tin đăng ký mới nhất
            await studentRegisterRepository.SaveAsync(
                RedisKey.StudentRegisterCourseClass(studentCode),
                () => Task.FromResult(studentRegister)
            );

            // Thông báo thành công
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