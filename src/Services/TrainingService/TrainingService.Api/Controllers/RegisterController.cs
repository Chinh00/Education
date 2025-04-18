using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;

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
}