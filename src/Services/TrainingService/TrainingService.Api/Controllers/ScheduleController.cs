using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class ScheduleController : BaseController
{
    /// <summary>
    /// Tạo thời khóa biểu cho kì đăng ký học
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<object> HandleGenerateScheduleAsync([FromBody] ScheduleCreateCommand command,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(command, cancellationToken);
    }
}