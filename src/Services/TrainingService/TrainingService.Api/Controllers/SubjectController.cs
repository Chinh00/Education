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
    /// Lấy cấu hình thời khóa biểu cho môn học
    /// </summary>
    /// <param name="subjectCode">Mã môn học</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("{subjectCode}/timeline-config")]
    public async Task<IActionResult> HandleGetSubjectTimelineConfigAsync(string subjectCode,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GetSubjectTimelineConfigQuery() {Id = subjectCode}, cancellationToken));
    }

    /// <summary>
    /// Tạo mới cấu hình thời khóa biểu cho môn học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut("timeline-config")]
    public async Task<object> HandleCreateSubjectTimelineConfigAsync(SubjectTimelineConfigCreateCommand.SubjectTimelineConfigCreateModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new SubjectTimelineConfigCreateCommand(model), cancellationToken));
    }

    
    
    
}