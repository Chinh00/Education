using Education.Infrastructure.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotificationService.AppCore.Usecases.Queries;

namespace NotificationService.Api.Controllers;

/// <inheritdoc />
public class NotificationController : BaseController
{
    /// <summary>
    /// Lấy danh sách thông báo
    /// </summary>
    /// <param name="query"></param>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> HandleGetNotificationQuery(
        [FromQuery] GetNotificationsQuery query)
    {
        return Ok(await Mediator.Send(query));
    }
}