using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class SemesterController : BaseController
{
    /// <summary>
    /// Lấy danh sách kì học
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandlerGetSemestersAsync([FromQuery]GetSemestersQuery query,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
    /// <summary>
    /// Tạo mới kì học
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost]
    [Authorize]
    public async Task<object> HandlerCreateSemesterAsync(CreateSemesterCommand command,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(command, cancellationToken);
    }
    /// <summary>
    /// Cập nhật kì học cho class
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut("config-class")]
    public async Task<object> HandlerConfigClassSemesterAsync(ConfigSemesterForClassCommand command,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(command, cancellationToken);
    }
}