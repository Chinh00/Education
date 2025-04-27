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

    /// <summary>
    /// Danh sách chuyên ngành
    /// </summary>
    /// <param name="query">Yêu cầu truy vấn lấy danh sách chuyên ngành</param>
    /// <param name="cancellationToken">Token hủy để dừng tác vụ không đồng bộ</param>
    /// <returns>Trả về danh sách chuyên ngành</returns>
    [HttpGet("speciality")]
    public async Task<IActionResult> HandleGetSpecialitiesAsync([FromQuery] GetSpecialitiesQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
}