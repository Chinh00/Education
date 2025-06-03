using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;
using TrainingService.AppCore.Usecases.Specs;

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
    [HttpPost]
    [Authorize]
    public async Task<object> HandlerRegisterWishAsync([FromBody] CreateRegisterConfigCommand configCommand,
        CancellationToken cancellationToken = default)
    {
        return await Mediator.Send(configCommand, cancellationToken);
    }
    
   
    /// <summary>
    /// Trạng thái đăng ký
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetRegisterStateAsync([FromQuery] GetRegistersStateQuery command,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }
    
    
    
    

    /// <summary>
    /// Lấy thông tin môn học đăng ký
    /// </summary>
    /// <param name="query">Truy vấn thông tin đăng ký của sinh viên</param>
    /// <param name="cancellationToken">Token để hủy thao tác không đồng bộ nếu cần</param>
    /// <returns>Kết quả thông tin đăng ký của sinh viên</returns>
    [HttpGet("subject-register")]
    public async Task<IActionResult> HandleGetStudentRegisterAsync([FromQuery] GetSubjectRegisterQuery query,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
    /// <summary>
    /// Tạo cấu hình đăng ký học phần
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("RegistrationPeriod")]
    public async Task<IActionResult> HandleCreateRegistrationPeriodAsync(CreateRegistrationPeriodCommand.CreateRegistrationPeriodModel model,
        CancellationToken cancellationToken = default)
    {
        return Ok(await Mediator.Send(new CreateRegistrationPeriodCommand(model), cancellationToken));
    }
    
    
    
    
}