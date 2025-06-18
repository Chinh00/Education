using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingService.AppCore.Usecases.Commands;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.Api.Controllers;

/// <inheritdoc />
[Authorize]
public class CourseClassController : BaseController
{
    /// <summary>
    /// Lấy danh sách lớp học
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> HandleGetCourseClassAsync([FromQuery]GetCourseClassesQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }

    /// <summary>
    /// Chạy thời khóa biểu tự động
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("GenerateSchedule")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleGenerateScheduleCourseClassAsync(GenerateScheduleCommand.GenerateScheduleModel model, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GenerateScheduleCommand(model), cancellationToken));
    }
    /// <summary>
    /// Chạy lệnh tạo lớp học từ cấu hình
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("GenerateCourseClasses")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleGenerateCourseClassesAsync(GenerateCourseClassesCommand.GenerateCourseClassesModel model, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new GenerateCourseClassesCommand(model), cancellationToken));
    }
    /// <summary>
    /// Tạo cấu hình lịch học cho môn học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("SubjectScheduleConfig")]
    public async Task<IActionResult> HandleCreateSubjectScheduleConfigAsync(CreateSubjectScheduleConfigCommand.CreateSubjectScheduleConfigModel model, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new CreateSubjectScheduleConfigCommand(model), cancellationToken));
    }
    
    /// <summary>
    /// Lấy cấu hình môn học 
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("SubjectScheduleConfig")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleGetSubjectScheduleConfigsAsync([FromQuery] GetSubjectScheduleConfigQuery query, CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    
    
    
    
    /// <summary>
    /// Tạo mới lớp học
    /// </summary>
    /// <param name="command"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> HandleCreateCourseClassAsync(CreateCourseClassCommand command,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(command, cancellationToken));
    }
    
    
    
    /// <summary>
    /// Lấy thấy khóa biểu
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("Schedule")]
    public async Task<IActionResult> HandleGetScheduleAsync([FromQuery] GetSlotTimelinesQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    /// <summary>
    /// Thêm lịch học cho lớp học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("Schedule")]
    public async Task<IActionResult> HandleAddCourseClassScheduleAsync(AddCourseClassSlotTimelineCommand.UpdateCourseClassSlotTimelineModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new AddCourseClassSlotTimelineCommand(model), cancellationToken));
    }

    /// <summary>
    /// Xóa lịch học của lớp học
    /// </summary>
    /// <param name="slotTimelineId"></param>
    /// <param name="cancellationToken"></param>
    /// <param name="courseClassCode"></param>
    /// <returns></returns>
    [HttpDelete("{courseClassCode}/Schedule/{slotTimelineId}")]
    public async Task<IActionResult> HandleRemoveScheduleAsync(string courseClassCode, string slotTimelineId,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new RemoveSlotTimelineCommand(courseClassCode, slotTimelineId), cancellationToken));
    }
    
    
    
    
    
    /// <summary>
    /// Lấy danh sách điều kiện mở lớp
    /// </summary>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("Condition")]
    public async Task<IActionResult> HandleGetCourseClassConditionAsync([FromQuery] GetCourseClassConditionQuery query,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(query, cancellationToken));
    }
    /// <summary>
    /// Cập nhật giáo viên cho lớp học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut("Teacher")]
    public async Task<IActionResult> HandleUpdateTeacherCourseClassAsync([FromBody] UpdateCourseTeacherCommand.UpdateCourseTeacherModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new UpdateCourseTeacherCommand(model), cancellationToken));
    }
    
    
    /// <summary>
    /// Cập nhật thông tin lớp học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<IActionResult> HandleUpdateCourseClassAsync([FromBody] UpdateCourseClassCommand.UpdateCourseClassCommandModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new UpdateCourseClassCommand(model), cancellationToken));
    }
    
    /// <summary>
    /// Xóa lớp học theo mã lớp học
    /// </summary>
    /// <param name="courseClassCode"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpDelete("{courseClassCode}")]
    public async Task<IActionResult> HandleUpdateCourseClassAsync(string courseClassCode,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new RemoveCourseClassCommand(courseClassCode), cancellationToken));
    }
    
    
    
    
    /// <summary>
    /// Cập nhật trạng thái của lớp học
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut("Status")]
    public async Task<IActionResult> HandleUpdateCourseClassStatusAsync([FromBody] UpdateCourseClassStatusCommand.UpdateCourseClassStatusModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new UpdateCourseClassStatusCommand(model), cancellationToken));
    }
    /// <summary>
    /// Hủy đăng ký học phần của sinh viên
    /// </summary>
    /// <param name="model"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPut("Student")]
    public async Task<IActionResult> HandleRemoveStudentFromCourseClassAsync([FromBody] DeleteStudentFromCourseClassCommand.DeleteStudentFromCourseClassModel model,
        CancellationToken cancellationToken)
    {
        return Ok(await Mediator.Send(new DeleteStudentFromCourseClassCommand(model), cancellationToken));
    }
    
    
}