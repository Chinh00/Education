using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using Google.OrTools.Sat;
using MediatR;
using MongoDB.Bson;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record GenerateScheduleCommand(GenerateScheduleCommand.GenerateScheduleModel Model) : ICommand<IResult>
{
    public record struct GenerateScheduleModel(string SemesterCode, string SubjectCode, List<string> CourseClassCodes);
    internal class Handler(
        IMongoRepository<Room> roomRepository,
        IMongoRepository<SubjectRegister> subjectRegisterRepository,
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository
    ) : IRequestHandler<GenerateScheduleCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
        {
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            var subjectScheduleConfigs = GetSampleData();
            var spec = new GetCourseClassByListCodeAndSemesterCodeSpec(request.Model.CourseClassCodes, request.Model.SemesterCode);

            var courseClasses = await courseClassRepository.FindAsync(spec, cancellationToken);

           
            return Results.Ok();
        }

        

        public static List<SubjectScheduleConfig> GetSampleData()
        {
            return
            [
                new SubjectScheduleConfig
                {
                    SubjectCode = "GEL111",
                    TotalTheoryCourseClass = 6,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 45,
                    PracticeTotalPeriod = 18,
                    TheorySessions = [3, 3],
                    PracticeSessions = [3],
                    WeekStart = 1,
                    SessionPriority = 0,
                    LectureRequiredConditions = ["Lecture"],
                    LabRequiredConditions = ["Lab"],
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "CSE488",
                    TotalTheoryCourseClass = 5,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 45,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 3],
                    PracticeSessions = [],
                    WeekStart = 1,
                    SessionPriority = 1,
                    LectureRequiredConditions = ["Lecture"],
        
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "MLP121",
                    TotalTheoryCourseClass = 7,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 3],
                    PracticeSessions = [],
                    WeekStart = 1,
                    SessionPriority = -1,
                    LectureRequiredConditions = ["Lecture"],
        
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "MLPE222",
                    TotalTheoryCourseClass = 7,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 3, 3],
                    PracticeSessions = [],
                    WeekStart = 1,
                    SessionPriority = 0,
                    LectureRequiredConditions = ["Lecture"],
        
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "SCSO232",
                    TotalTheoryCourseClass = 7,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 3],
                    PracticeSessions = [],
                    WeekStart = 1,
                    SessionPriority = -1,
                    LectureRequiredConditions = ["Lecture"],
        
                }
            ];
        }
    }
}