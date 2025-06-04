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
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost]
    [Authorize]
    public async Task<object> HandlerCreateSemesterAsync(CreateSemesterCommand.CreateSemesterModel model,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(new CreateSemesterCommand(model), cancellationToken);
    }
}