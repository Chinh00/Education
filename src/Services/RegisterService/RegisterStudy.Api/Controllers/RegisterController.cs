using Education.Infrastructure.Controllers;
using Microsoft.AspNetCore.Mvc;
using RegisterStudy.AppCore.Usecases.Commands;

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
    public async Task<object> HandleCreateWishRegisterAsync(CreateWishSubjectsCommand command, CancellationToken cancellationToken)
    {
        return await Mediator.Send(command, cancellationToken);
    }
}