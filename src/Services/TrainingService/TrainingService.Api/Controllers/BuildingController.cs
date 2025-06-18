using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class BuildingController : BaseController
{
    /// <summary>
    /// Danh sách các phòng
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("Room")]
    public async Task<IActionResult> HandleGetRoomsAsync(
        [FromQuery] GetRoomsQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    /// <summary>
    /// Danh sách phòng trống theo thời gian và điều kiện
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("Room/Free")]
    public async Task<IActionResult> HandleGetRoomsFreeBySessionLengthAsync(
        [FromQuery] GetRoomBySlotFreeQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
}