using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class EventStoreController : BaseController
{
    /// <summary>
    /// Lấy lịch sử thay đổi của bản ghi
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetEventsStoreAsync([FromQuery] GetEventsStoreQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
}