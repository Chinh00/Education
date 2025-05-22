using Education.Infrastructure.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentService.AppCore.Usecases;

namespace StudentService.Api.Controllers;

/// <inheritdoc />
public class StudentController : BaseController
{
    /// <summary>
    /// Thông tin chi tiết sinh viên
    /// </summary>
    /// <param name="studentCode"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("detail")]
    public async Task<IActionResult> HandleGetStudentDetailAsync([FromQuery] string studentCode,
        CancellationToken cancellationToken) =>
        Ok(await Mediator.Send(new GetStudentDetailQuery(studentCode), cancellationToken));

    /// <summary>
    /// Thông tin sinh viên chi tiết
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [Authorize(Roles = "student, admin")]
    [HttpGet]
    public async Task<IActionResult> HandleGetStudentInformationAsync(CancellationToken cancellationToken) =>
        Ok(await Mediator.Send(new GetStudentInformationQuery(), cancellationToken));


    /// <summary>
    /// Danh sách sinh viên
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("all")]
    public async Task<IActionResult> HandleGetStudentsAsync([FromQuery] GetStudentsQuery query,
        CancellationToken cancellationToken) => Ok(await Mediator.Send(query, cancellationToken));

    /// <summary>
    /// Đông bộ sinh viên từ Data Provider
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("Sync")]
    [Authorize]
    public async Task<IActionResult> HandleSyncStudentFromDataProviderAsync(CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new SyncStudentFromDataProviderQuery(), cancellationToken));
    }
    
}