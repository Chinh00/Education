using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using MediatR;
using Microsoft.AspNetCore.Components.Server;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record GenerateCourseClassesCommand(GenerateCourseClassesCommand.GenerateCourseClassesModel Model) : ICommand<IResult>
{
    public record struct GenerateCourseClassesModel(string SemesterCode, string SubjectCode, int Stage, int TotalTheoryCourseClass = 0);
    
    internal class Handler(
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository,
        IMongoRepository<Room> roomRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository)
        : IRequestHandler<GenerateCourseClassesCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateCourseClassesCommand request, CancellationToken cancellationToken)
        {
            var (semesterCode, subjectCode, stage, totalTheoryCourseClass) = request.Model;
            if (stage is 0 or 1) 
            {
                var spec = new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode, [(SubjectTimelineStage)stage]);
                var config = await subjectScheduleConfigRepository.FindOneAsync(spec, cancellationToken);
                if (config == null)
                {
                    return Results.BadRequest("Subject schedule config not found for this subject and semester.");
                }
                var courseClasses = GenerateCourseClasses(semesterCode, config, totalTheoryCourseClass);
                if (courseClasses == null || !courseClasses.Any())
                {
                    return Results.BadRequest("No course classes generated for the provided configuration.");
                }
                
                var subjectScheduleConfigs = await subjectScheduleConfigRepository.FindAsync(
                    new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode, [(SubjectTimelineStage)stage]), cancellationToken);
                
                foreach (var subjectScheduleConfig in subjectScheduleConfigs)
                {
                    subjectScheduleConfig.TotalTheoryCourseClass = totalTheoryCourseClass;
                    await subjectScheduleConfigRepository.UpsertOneAsync(new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode, [(SubjectTimelineStage)stage]), subjectScheduleConfig, cancellationToken);
                }

                foreach (var courseClass in courseClasses)
                {
                    

                    await courseClassRepository.AddAsync(new CourseClass()
                    {
                        CourseClassCode = courseClass.CourseClassCode,
                        CourseClassName = courseClass.CourseClassCode,
                        Stage = courseClass.Stage,
                        SubjectCode = courseClass.SubjectCode,
                        ParentCourseClassCode = courseClass.ParentCourseClassCode
                    }, cancellationToken);
                }
            
                
                return Results.Ok(courseClasses);
                
                
            }

            if (stage is 4) 
            {
                var spec = new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode, [SubjectTimelineStage.Stage1Of2, SubjectTimelineStage.Stage2Of2]);
                var config = await subjectScheduleConfigRepository.FindAsync(spec, cancellationToken);
                
                foreach (var subjectScheduleConfig in config)
                {
                    var stageSpec = new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectScheduleConfig.SubjectCode, [subjectScheduleConfig.Stage]);
                    var subjectScheduleConfigUpdate = await subjectScheduleConfigRepository.FindOneAsync(stageSpec, cancellationToken);
                    subjectScheduleConfigUpdate.TotalTheoryCourseClass = totalTheoryCourseClass;
                    await subjectScheduleConfigRepository.UpsertOneAsync(stageSpec, subjectScheduleConfigUpdate, cancellationToken);
                }
                
                if (config == null || !config.Any())
                {
                    return Results.BadRequest("Subject schedule config not found for this subject and semester.");
                }
                var courseClasses = GenerateCourseClasses(semesterCode, config.ToList(), totalTheoryCourseClass);
                if (courseClasses == null || !courseClasses.Any())
                {
                    return Results.BadRequest("No course classes generated for the provided configurations.");
                }
                
                foreach (var courseClass in courseClasses)
                {
                
                    await courseClassRepository.AddAsync(new CourseClass()
                    {
                        CourseClassCode = courseClass.CourseClassCode,
                        CourseClassName = courseClass.CourseClassCode,
                        Stage = courseClass.Stage,
                        SubjectCode = courseClass.SubjectCode,
                        ParentCourseClassCode = courseClass.ParentCourseClassCode,
                    }, cancellationToken);
                }
                return Results.Ok(courseClasses);
            }
            
            

            return Results.BadRequest();
        }
        
        public static List<CourseClass> GenerateCourseClasses(string semesterCode, List<SubjectScheduleConfig> configs, int totalTheoryCourseClass)
        {
            var result = new List<CourseClass>();
            int globalIndex = 1;
            var subjectCode = configs.FirstOrDefault()?.SubjectCode ?? "";
            var rand = new Random();

            for (int i = 0; i < totalTheoryCourseClass; i++)
            {
                // Lớp cha lý thuyết cho cả 2 giai đoạn
                string stagePart = "2GD";
                var theoryClassCode = $"{semesterCode}_{stagePart}_{subjectCode}-LT{i + 1}";
                var theoryCourseClass = new CourseClass
                {
                    SubjectCode = subjectCode,
                    CourseClassCode = theoryClassCode,
                    CourseClassName = $"LT {subjectCode} {i + 1}",
                    Index = globalIndex++,
                    Stage = SubjectTimelineStage.StageBoth,
                    SessionLengths = new List<int>(),
                    NumberStudentsExpected = 0,
                    CourseClassType = CourseClassType.Lecture,
                    SemesterCode = semesterCode,
                };
                result.Add(theoryCourseClass);

                // Lặp qua từng giai đoạn (stage) để tạo các lớp con
                foreach (var subjectScheduleConfig in configs)
                {
                    if (subjectScheduleConfig == null) continue;

                    var childStage = (int)subjectScheduleConfig.Stage switch
                    {
                        2 => "GD1",
                        3 => "GD2",
                    };
                    var childTheoryClassCode = $"{semesterCode}_{childStage}_{subjectCode}-LT{i + 1}";
                    var childTheoryCourseClass = new CourseClass
                    {
                        SubjectCode = subjectCode,
                        CourseClassCode = childTheoryClassCode,
                        CourseClassName = $"LT {subjectCode} {i + 1}",
                        Index = globalIndex++,
                        Stage = (SubjectTimelineStage)subjectScheduleConfig?.Stage,
                        SessionLengths = subjectScheduleConfig.TheorySessions?.ToList() ?? new List<int>(),
                        NumberStudentsExpected = rand.Next(30, 40),
                        CourseClassType = CourseClassType.Lecture,
                        ParentCourseClassCode = theoryClassCode,
                        SemesterCode = semesterCode,
                    };
                    result.Add(childTheoryCourseClass);

                    // Nếu có thực hành, tạo các lớp thực hành là con của lớp lý thuyết con
                    if (subjectScheduleConfig.PracticeTotalPeriod > 0)
                    {
                        for (int p = 0; p < 2; p++)
                        {
                            var labClassCode = $"{semesterCode}_{childStage}_{subjectCode}-TH{i + 1}-{p + 1}";
                            var labCourseClass = new CourseClass
                            {
                                SubjectCode = subjectCode,
                                CourseClassCode = labClassCode,
                                CourseClassName = $"TH {subjectCode} {i + 1}-{p + 1}",
                                Index = globalIndex++,
                                SemesterCode = semesterCode,
                                Stage = (SubjectTimelineStage)subjectScheduleConfig?.Stage,
                                CourseClassType = CourseClassType.Lab,
                                SessionLengths = subjectScheduleConfig.PracticeSessions?.ToList() ?? new List<int>(),
                                ParentCourseClassCode = childTheoryClassCode,
                                NumberStudentsExpected = rand.Next(20, 30)
                            };
                            result.Add(labCourseClass);
                        }
                    }
                }
            }
            return result;
        }
        
        public static List<CourseClass> GenerateCourseClasses(string semesterCode, SubjectScheduleConfig config,int totalTheoryCourseClass)
        {
            var result = new List<CourseClass>();
            int globalIndex = 1;

            for (int i = 0; i < totalTheoryCourseClass; i++)
            {
                string stagePart = new List<SubjectTimelineStage> { SubjectTimelineStage.Stage1Of2, SubjectTimelineStage.Stage2Of2 }
                    .Contains(config.Stage)
                    ? "2GD"
                    : "GD" + config.Stage;

                var theoryClassCode = $"{semesterCode}_{stagePart}_{config.SubjectCode}-LT{i + 1}";
                var theoryCourseClass = new CourseClass
                {
                    SubjectCode = config.SubjectCode,
                    CourseClassCode = theoryClassCode,
                    CourseClassName = $"LT {config.SubjectCode} {i + 1}",
                    Index = globalIndex++,
                    Stage = config.Stage,
                    SessionLengths = config.TheorySessions.ToList(),
                    NumberStudentsExpected = (new Random()).Next(30, 40),
                    CourseClassType = CourseClassType.Lecture,
                    SemesterCode = semesterCode
                };
                result.Add(theoryCourseClass);
                if (config?.PracticeTotalPeriod > 0)
                {
                    for (int p = 0; p < 2; p++)
                    {
                        var labClassCode = $"{semesterCode}_{config.SubjectCode}-TH{i + 1}-{p + 1}";
                        var labCourseClass = new CourseClass
                        {
                            SubjectCode = config.SubjectCode,
                            CourseClassCode = labClassCode,
                            CourseClassName = $"TH {config.SubjectCode} {i + 1}-{p + 1}",
                            Index = globalIndex++,
                            Stage = config.Stage,
                            CourseClassType = CourseClassType.Lab,
                            SessionLengths = config.PracticeSessions.ToList(),
                            ParentCourseClassCode = theoryClassCode,
                            NumberStudentsExpected = (new Random()).Next(20, 30),
                            SemesterCode = semesterCode
                            
                        };
                        result.Add(labCourseClass);
                    }
                }
            }
            return result;
        }
    }
    
    
}