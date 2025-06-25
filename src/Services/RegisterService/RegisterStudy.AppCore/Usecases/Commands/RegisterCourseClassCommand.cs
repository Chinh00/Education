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
            var courseClassType = courseClass.CourseClassType;

            // Đảm bảo danh sách sinh viên không null
            courseClass.Students ??= new List<string>();

            // Kiểm tra đã đăng ký chưa
            if (courseClass.Students.Contains(studentCode))
            {
                // lop chinh thi huy nhu binh thuong
                if (courseClassType == 0)
                {
                    var student = await studentRegisterRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) 
                                  ?? new StudentRegister()
                                  {
                                      StudentCode = studentCode,
                                      CourseClassCode = new List<string>() 
                                  };
                    //  da dang ky Xóa đăng ký cũ của môn này (nếu có)
                    var e = student.CourseClassCode.Where(s => s.Contains($"{subjectCode}")).ToList(); 
                    foreach (var se in e)
                    {
                        var cc = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se));
                        cc.Students.Remove(studentCode);
                        await repository.SaveAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, se), () => Task.FromResult(cc));
                    }
                    student.CourseClassCode.RemoveAll(c => c.Contains($"{subjectCode}"));
                    await studentRegisterRepository.SaveAsync(
                        RedisKey.StudentRegisterCourseClass(studentCode),
                        () => Task.FromResult(student));

                    
                    return Results.BadRequest("Đã hủy thành công học phần này."); 
                }
                // neu ma khong phai lop chinh => huy
                else
                {
                    var student = await studentRegisterRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) 
                                  ?? new StudentRegister()
                                  {
                                      StudentCode = studentCode,
                                      CourseClassCode = new List<string>() 
                                  };
                    var firstOrDefault = student.CourseClassCode.FirstOrDefault(e => e == courseClassCode);
                    var cc = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, firstOrDefault));
                    if (cc is not null)
                    {
                        cc.Students.Remove(studentCode);
                    }
                    await repository.SaveAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, firstOrDefault), () => Task.FromResult(cc));
                    await studentRegisterRepository.SaveAsync(
                        RedisKey.StudentRegisterCourseClass(studentCode),
                        () => Task.FromResult(student));
                }
                
            }

            // Kiểm tra số lượng sinh viên đã tối đa chưa
            if (courseClass.Students.Count >= courseClass.NumberStudentsExpected)
            {
                return Results.BadRequest("Lớp học phần đã đủ số lượng sinh viên.");
            }
            // thon tin dang ky hien tai
            var studentRegister = await studentRegisterRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) 
            ?? new StudentRegister()
              {
                  StudentCode = studentCode,
                  CourseClassCode = new List<string>()
              };
            if (courseClassType == 0)
            {
                // lay danh sach cac lop da dang ky cua mon hoc nay
                var existingCourseClasses = studentRegister.CourseClassCode
                    .Where(c => c.Contains($"{subjectCode}"))
                    .ToList();
                // neu lop dang ky la lop chinh thi xoa cac lop chinh cu va lop con
                foreach (var existingCourseClass in existingCourseClasses)
                {
                    var existingClass = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, existingCourseClass));
                    if (existingClass != null)
                    {
                        existingClass.Students.Remove(studentCode);
                        await repository.SaveAsync(
                            RedisKey.SubjectCourseClass(semesterCode, subjectCode, existingCourseClass),
                            () => Task.FromResult(existingClass));
                    }
                }
                // xoa cac lop con lien quan den lop chinh va lop chinh
                studentRegister.CourseClassCode.RemoveAll(c => c.Contains($"{subjectCode}"));
                // luu lai lop dang ky moi
                studentRegister.CourseClassCode.Add(courseClassCode);
                await studentRegisterRepository.SaveAsync(
                    RedisKey.StudentRegisterCourseClass(studentCode),
                    () => Task.FromResult(studentRegister));
                // cap nhat danh sach sinh vien cua lop chinh
                courseClass.Students.Add(studentCode);
                await repository.SaveAsync(
                    courseClassKey,
                    () => Task.FromResult(courseClass));
            }
            // neu dang ky ko phai lop chinh ma la lop thanh phan
            else
            {
                // lay ra cac lop thanh phan da dang ky cua mon nay
                var existingCourseClass = studentRegister.CourseClassCode
                    .FirstOrDefault(c => c.Contains($"{subjectCode}") && c.Contains("TH"));
                if (existingCourseClass is not null)
                {
                    var existingClass = await repository.GetAsync(RedisKey.SubjectCourseClass(semesterCode, subjectCode, existingCourseClass));
                    if (existingClass != null)
                    {
                        existingClass.Students.Remove(studentCode);
                        await repository.SaveAsync(
                            RedisKey.SubjectCourseClass(semesterCode, subjectCode, existingCourseClass),
                            () => Task.FromResult(existingClass));
                    }
                }
                // xoa lop thanh phan cu neu co
                studentRegister.CourseClassCode.RemoveAll(c => c.Contains($"{subjectCode}") && c.Contains("TH"));
                // luu lai lop dang ky moi
                studentRegister.CourseClassCode.Add(courseClassCode);
                await studentRegisterRepository.SaveAsync(
                    RedisKey.StudentRegisterCourseClass(studentCode),
                    () => Task.FromResult(studentRegister));
                // cap nhat danh sach sinh vien cua lop thanh phan
                courseClass.Students.Add(studentCode);
                await repository.SaveAsync(
                    courseClassKey,
                    () => Task.FromResult(courseClass));
            }
            
            
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