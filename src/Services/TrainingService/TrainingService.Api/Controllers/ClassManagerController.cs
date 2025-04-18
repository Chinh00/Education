using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class ClassManagerController : BaseController
{
    /// <summary>
    /// Lấy danh sách lớp quản lý
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetClassManagerAsync([FromQuery] GetClassManagerQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
}