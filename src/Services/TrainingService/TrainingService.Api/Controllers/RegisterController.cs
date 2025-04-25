using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class RegisterController : BaseController
{
    /// <summary>
    /// Tạo đăng ký nguyện vọng học
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("create-wish-register")]
    public async Task<object> HandlerRegisterWishAsync([FromBody] CreateWishRegisterCommand command,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(command, cancellationToken);
    }
    
    /// <summary>
    /// Lấy danh sách đăng ký cấu hình
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetRegistersAsync([FromQuery] GetRegistersQuery command,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }
}