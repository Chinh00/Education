using Education.Infrastructure.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegisterStudy.AppCore.Usecases.Commands;
using RegisterStudy.AppCore.Usecases.Queries;

namespace RegisterStudy.Api.Controllers;

/// <inheritdoc />
public class RegisterController : BaseController
{
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