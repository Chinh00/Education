using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class DepartmentController : BaseController
{
    /// <summary>
    /// Danh sách khoa
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetDepartmentsAsync([FromQuery] GetDepartmentsQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
}