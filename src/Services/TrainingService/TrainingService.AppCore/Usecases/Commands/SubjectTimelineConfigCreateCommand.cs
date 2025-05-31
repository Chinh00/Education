using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record SubjectTimelineConfigCreateCommand(SubjectTimelineConfigCreateCommand.SubjectTimelineConfigCreateModel Model) : ICommand<IResult>
{
    public readonly record struct SubjectTimelineConfigCreateModel(
        string SubjectCode,
        int PeriodTotal,
        int LectureTotal,
        int LectureLesson,
        int LecturePeriod,
        int LabTotal,
        int LabLesson,
        int LabPeriod,
        int MinDaySpaceLecture,
        int MinDaySpaceLab,
        int LectureMinStudent,
        int LabMinStudent,
        int LectureStartWeek,
        int LabStartWeek,
        int Stage
        );
    
    internal class Handler(IMongoRepository<SubjectTimelineConfig> repository)
        : IRequestHandler<SubjectTimelineConfigCreateCommand, IResult>
    {
        public async Task<IResult> Handle(SubjectTimelineConfigCreateCommand request, CancellationToken cancellationToken)
        {
            var (subjectCode, periodTotal, lectureTotal, lectureLesson, lecturePeriod, labTotal, labLesson, labPeriod,
                minDaySpaceLecture, minDaySpaceLab, lectureMinStudent, labMinStudent, lectureStartWeek, labStartWeek, stage) = request.Model;

            var spec = new GetSubjectTimelineBySubjectCodeSpec(subjectCode);
            var subjectTimelineConfig = await repository.FindOneAsync(spec, cancellationToken) ?? new SubjectTimelineConfig();


            subjectTimelineConfig.SubjectCode = subjectCode;
            subjectTimelineConfig.PeriodTotal = periodTotal;
            subjectTimelineConfig.LectureTotal = lectureTotal;
            subjectTimelineConfig.LectureLesson = lectureLesson;
            subjectTimelineConfig.LecturePeriod = lecturePeriod;
            subjectTimelineConfig.LabTotal = labTotal;
            subjectTimelineConfig.LabLesson = labLesson;
            subjectTimelineConfig.LabPeriod = labPeriod;
            subjectTimelineConfig.MinDaySpaceLecture = minDaySpaceLecture;
            subjectTimelineConfig.MinDaySpaceLab = minDaySpaceLab;
            subjectTimelineConfig.LectureMinStudent = lectureMinStudent;
            subjectTimelineConfig.LabMinStudent = labMinStudent;
            subjectTimelineConfig.LectureStartWeek = labMinStudent;
            subjectTimelineConfig.LabStartWeek = labMinStudent;
            subjectTimelineConfig.Stage = (SubjectTimelineStage)stage;
            
            var result = await repository.UpsertOneAsync(spec, subjectTimelineConfig, cancellationToken);
            return Results.Ok(ResultModel<SubjectTimelineConfig>.Create(result));
        }
    }
}