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
            var spec = new GetSubjectScheduleConfigSubjectCodeSpec(request.Model.SemesterCode, request.Model.Model.SubjectCode, [request.Model.Model.Stage]);
            var existingConfig = await subjectScheduleConfigRepository.FindOneAsync(spec, cancellationToken) ?? new SubjectScheduleConfig()
            {
                SubjectCode = request.Model.Model.SubjectCode,
                SemesterCode = request.Model.SemesterCode,
                Stage = request.Model.Model.Stage,
                TheoryTotalPeriod = request.Model.Model.TheoryTotalPeriod,
                PracticeTotalPeriod = request.Model.Model.PracticeTotalPeriod,
                TheorySessions = request.Model.Model.TheorySessions,
                PracticeSessions = request.Model.Model.PracticeSessions,
                WeekStart = request.Model.Model.WeekStart,
                SessionPriority = request.Model.Model.SessionPriority,
                LectureRequiredConditions = request.Model.Model.LectureRequiredConditions.ToList(),
                LabRequiredConditions = request.Model.Model.LabRequiredConditions.ToList(),
            };
            existingConfig.TheoryTotalPeriod = request.Model.Model.TheoryTotalPeriod;
            existingConfig.PracticeTotalPeriod = request.Model.Model.PracticeTotalPeriod;
            existingConfig.TheorySessions = request.Model.Model.TheorySessions;
            existingConfig.PracticeSessions = request.Model.Model.PracticeSessions;
            existingConfig.WeekStart = request.Model.Model.WeekStart;
            existingConfig.SessionPriority = request.Model.Model.SessionPriority;
            existingConfig.LectureRequiredConditions = request.Model.Model.LectureRequiredConditions.ToList();
            existingConfig.LabRequiredConditions = request.Model.Model.LabRequiredConditions.ToList();
            
            await subjectScheduleConfigRepository.UpsertOneAsync(spec, existingConfig, cancellationToken);
            return Results.Ok();
        }
    }
    
}