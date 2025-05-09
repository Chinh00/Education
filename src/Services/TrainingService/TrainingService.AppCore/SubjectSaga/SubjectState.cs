using MassTransit;

namespace TrainingService.AppCore.SubjectSaga;

public class SubjectState : SagaStateMachineInstance, ISagaVersion
{
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
    public string SubjectCode { get; set; } = null!;
    public string SubjectName { get; set; } = null!;
    public string CurrentState { get; set; } = null!;
    public int Credit { get; set; }
    public string TeacherCode { get; set; } = null!;
    public string ClassCode { get; set; } = null!;
    public string ClassName { get; set; } = null!;
    public string SemesterCode { get; set; } = null!;
    public string SemesterName { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}