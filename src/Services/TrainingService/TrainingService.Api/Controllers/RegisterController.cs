using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class RegisterController : BaseController
{
    /// <summary>
    /// Tạo đăng ký nguyện vọng học
    /// </summary>
    /// <param name="configCommand"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("create-wish-register")]
    [Authorize]
    public async Task<object> HandlerRegisterWishAsync([FromBody] CreateRegisterConfigCommand configCommand,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(configCommand, cancellationToken);
    }
    
    /// <summary>
    /// Lấy danh sách đăng ký cấu hình
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetRegistersAsync([FromQuery] GetRegistersQuery command,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }

    /// <summary>
    /// Lấy thông tin đăng ký của sinh viên
    /// </summary>
    /// <param name="query">Truy vấn thông tin đăng ký của sinh viên</param>
    /// <param name="cancellationToken">Token để hủy thao tác không đồng bộ nếu cần</param>
    /// <returns>Kết quả thông tin đăng ký của sinh viên</returns>
    [HttpGet("student-register")]
    public async Task<IActionResult> HandleGetStudentRegisterAsync([FromQuery] GetStudentRegisterQuery query,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
    
}