using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.Domain;

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
        int LabMinStudent);
    
    internal class Handler(IMongoRepository<SubjectTimelineConfig> repository)
        : IRequestHandler<SubjectTimelineConfigCreateCommand, IResult>
    {
        public async Task<IResult> Handle(SubjectTimelineConfigCreateCommand request, CancellationToken cancellationToken)
        {
            var (subjectCode, periodTotal, lectureTotal, lectureLesson, lecturePeriod, labTotal, labLesson, labPeriod,
                minDaySpaceLecture, minDaySpaceLab, lectureMinStudent, labMinStudent) = request.Model;
            var result = await repository.AddAsync(new SubjectTimelineConfig()
            {
                SubjectCode = subjectCode,
                PeriodTotal = periodTotal,
                LectureTotal = lectureTotal,
                LectureLesson = lectureLesson,
                LecturePeriod = lecturePeriod,
                LabTotal = labTotal,
                LabLesson = labLesson,
                LabPeriod = labPeriod,
                MinDaySpaceLecture = minDaySpaceLecture,
                MinDaySpaceLab = minDaySpaceLab,
                LectureMinStudent = lectureMinStudent,
                LabMinStudent = labMinStudent,
            }, cancellationToken);
            return Results.Ok(ResultModel<SubjectTimelineConfig>.Create(result));
        }
    }
}