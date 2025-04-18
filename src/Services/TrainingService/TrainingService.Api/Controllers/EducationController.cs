using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class EducationController : BaseController
{
    /// <summary>
    /// Lấy danh sách chương trình đào tạo
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetEducationProgramsAsync([FromQuery] GetEducationProgramsQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
}