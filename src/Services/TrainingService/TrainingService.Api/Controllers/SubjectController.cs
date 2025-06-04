using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
public class SubjectController : BaseController
{
    /// <summary>
    /// Lấy danh sách môn học 
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetSubjectsAsync([FromQuery] GetSubjectsQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
    /// <summary>
    /// Cập nhật cấu hình môn học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<IActionResult> HandleUpdateSubjectAsync( UpdateSubjectCommand.UpdateSubjectModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new UpdateSubjectCommand(model), cancellationToken));
    }
    
    

    
}