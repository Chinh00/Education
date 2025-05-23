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
    [HttpPost]
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
    [HttpGet("current")]
    public async Task<IActionResult> HandleGetRegisterCourseCurrentAsync(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetRegisterCourseCurrentQuery(), cancellationToken));
    }

    /// <summary>
    /// Thông tin đã đăng ký
    /// </summary>
    /// <param name="educationCode"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("{educationCode}")]
    [Authorize]
    public async Task<IActionResult> HandleGetStudentRegisterAsync(string educationCode, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetRegisterCourseStateQuery(educationCode), cancellationToken));
    }

}