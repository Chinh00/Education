using Education.Contract.IntegrationEvents;
using Education.Infrastructure.Controllers;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegisterStudy.AppCore.Usecases.Commands;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.AppCore.Usecases.Queries;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.Api.Controllers;

/// <inheritdoc />
public class RegisterController(
    IRegisterRepository<CourseClass> registerRepository,
    ITopicProducer<CourseClassLockedIntegrationEvent> producer, ITopicProducer<StudentCourseClassLockedIntegrationEvent> studentProducer) : BaseController
{
    private async Task<Dictionary<string, List<string>>> GetStudentSubjects(string semesterCode)
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
                if (!studentSubjects[studentCode].Contains(courseClass.CourseClassCode))
                    studentSubjects[studentCode].Add(courseClass.CourseClassCode);
            }
        }

        return studentSubjects;
    }
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var key = RedisKey.SubjectCourseClass("1_2024_2025", "*", "*");
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
        // await producer.Produce(new CourseClassLockedIntegrationEvent(listCourseClass), CancellationToken.None);
        var res = await GetStudentSubjects("1_2024_2025");
        foreach (var keyValuePair in res)
        {
            await studentProducer.Produce(
                new StudentCourseClassLockedIntegrationEvent(keyValuePair.Key, "1_2024_2025", keyValuePair.Value),
                CancellationToken.None);
            
        }
        return Ok();
    }
    /// <summary>
    /// Đăng ký nguyện vọng
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("RegisterWish")]
    [Authorize]
    public async Task<object> HandleCreateWishRegisterAsync(CreateWishSubjectsCommand command, CancellationToken cancellationToken)
    {
        return await Mediator.Send(command, cancellationToken);
    }

    /// <summary>
    /// Thông tin đợt đăng ký nguyện vọng
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("RegisterWish")]
    public async Task<IActionResult> HandleGetRegisterCourseCurrentAsync(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetRegisterCourseCurrentQuery(), cancellationToken));
    }
    
    
    /// <summary>
    /// Danh sách nguyện vọng đã đăng ký
    /// </summary>
    /// <param name="educationCode"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("RegisterWish/{educationCode}")]
    [Authorize]
    public async Task<IActionResult> HandleGetStudentRegisterAsync(string educationCode, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetRegisterCourseStateQuery(educationCode), cancellationToken));
    }
    
    /// <summary>
    /// Thông tin đăng ký lớp học học phần 
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("RegisterCourseClass/State")]
    public async Task<IActionResult> HandleGetRegisterCourseClassAsync(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetStudentRegisterQuery(), cancellationToken));
    }

    /// <summary>
    /// Danh sách lớp học học phần theo mã môn học
    /// </summary>
    /// <param name="subjectCode">Mã môn học</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("RegisterCourseClass/{subjectCode}")]
    public async Task<IActionResult> HandleGetCourseClassBySubjectCodeAsync(string subjectCode, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetCourseClassBySubjectCodeQuery(subjectCode), cancellationToken));
    }
    
    
    
    /// <summary>
    /// Đăng ký lớp học phần
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("RegisterCourseClass")]
    [Authorize]
    public async Task<IActionResult> HandleRegisterCourseClassAsync(RegisterCourseClassCommand.RegisterCourseClassModel model, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new RegisterCourseClassCommand(model), cancellationToken));
    }
    
    /// <summary>
    /// Thông tin đăng ký học phần hiện tại của sinh viên
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("RegisterCourseClass")]
    [Authorize]
    public async Task<IActionResult> HandleRegisterCourseClassAsync(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetRegisterCurrentCourseClassQuery(), cancellationToken));
    }
    
    
    
    

}