using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateSubjectScheduleConfigCommand(CreateSubjectScheduleConfigCommand.CreateSubjectScheduleConfigModel Model) : ICommand<IResult>
{
    public record struct CreateSubjectScheduleConfigModel(string SemesterCode, SubjectScheduleConfigModel Model);
    public readonly record struct SubjectScheduleConfigModel(
        string SubjectCode,
        int TotalTheoryCourseClass,
        SubjectTimelineStage Stage,
        int TheoryTotalPeriod,
        int PracticeTotalPeriod,
        int[] TheorySessions,
        int[] PracticeSessions,
        int WeekStart,
        int SessionPriority,
        List<string> LectureRequiredConditions,
        List<string> LabRequiredConditions
    );
    internal class Handler(IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository)
        : IRequestHandler<CreateSubjectScheduleConfigCommand, IResult>
    {
        public async Task<IResult> Handle(CreateSubjectScheduleConfigCommand request, CancellationToken cancellationToken)
        {
            var spec = new GetSubjectScheduleConfigSubjectCodeSpec(request.Model.SemesterCode, request.Model.Model.SubjectCode);
            var existingConfig = await subjectScheduleConfigRepository.FindOneAsync(spec, cancellationToken);
            if (existingConfig != null)
            {
                return Results.BadRequest("Subject schedule config already exists for this subject and semester.");
            }
            var newConfig = new SubjectScheduleConfig
            {
                SubjectCode = request.Model.Model.SubjectCode,
                SemesterCode = request.Model.SemesterCode,
                TotalTheoryCourseClass = request.Model.Model.TotalTheoryCourseClass,
                Stage = request.Model.Model.Stage,
                TheoryTotalPeriod = request.Model.Model.TheoryTotalPeriod,
                PracticeTotalPeriod = request.Model.Model.PracticeTotalPeriod,
                TheorySessions = request.Model.Model.TheorySessions,
                PracticeSessions = request.Model.Model.PracticeSessions,
                WeekStart = request.Model.Model.WeekStart,
                SessionPriority = request.Model.Model.SessionPriority,
                LectureRequiredConditions = request.Model.Model.LectureRequiredConditions.ToList(),
                LabRequiredConditions = request.Model.Model.LabRequiredConditions.ToList()
            };
            await subjectScheduleConfigRepository.AddAsync(newConfig, cancellationToken);
            return Results.Ok();
        }
    }
    
}