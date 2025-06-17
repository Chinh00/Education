using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using Microsoft.AspNetCore.Components.Server;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record GenerateCourseClassesCommand(GenerateCourseClassesCommand.GenerateCourseClassesModel Model) : ICommand<IResult>
{
    public record struct GenerateCourseClassesModel(string SemesterCode, string SubjectCode, int Stage);
    
    internal class Handler(IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository)
        : IRequestHandler<GenerateCourseClassesCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateCourseClassesCommand request, CancellationToken cancellationToken)
        {
            var (semesterCode, subjectCode, stage) = request.Model;
            if (stage is 0 or 1) 
            {
                var spec = new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode);
                var config = await subjectScheduleConfigRepository.FindOneAsync(spec, cancellationToken);
                if (config == null)
                {
                    return Results.BadRequest("Subject schedule config not found for this subject and semester.");
                }
                var courseClasses = GenerateCourseClasses(semesterCode, config);
                if (courseClasses == null || !courseClasses.Any())
                {
                    return Results.BadRequest("No course classes generated for the provided configuration.");
                }
            }

            if (stage is not 2) return Results.Ok();
            {
                var spec = new GetSubjectScheduleConfigSubjectCodeSpec(semesterCode, subjectCode);
                var config = await subjectScheduleConfigRepository.FindAsync(spec, cancellationToken);
                if (config == null || !config.Any())
                {
                    return Results.BadRequest("Subject schedule config not found for this subject and semester.");
                }
                var courseClasses = GenerateCourseClasses(semesterCode, config.ToList());
                if (courseClasses == null || !courseClasses.Any())
                {
                    return Results.BadRequest("No course classes generated for the provided configurations.");
                }
            }


            return Results.Ok();
        }
        
        public static List<CourseClass> GenerateCourseClasses(string semesterCode, List<SubjectScheduleConfig> configs)
        {
            var result = new List<CourseClass>();
            int globalIndex = 1;
            var totalTheoryCourseClass = configs.FirstOrDefault()?.TotalTheoryCourseClass ?? 0;
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
                };
                result.Add(theoryCourseClass);

                // Lặp qua từng giai đoạn (stage) để tạo các lớp con
                foreach (var subjectScheduleConfig in configs)
                {
                    if (subjectScheduleConfig == null) continue;

                    var childStage = subjectScheduleConfig.Stage;
                    var childTheoryClassCode = $"{semesterCode}_{childStage}_{subjectCode}-LT{i + 1}";
                    var childTheoryCourseClass = new CourseClass
                    {
                        SubjectCode = subjectCode,
                        CourseClassCode = childTheoryClassCode,
                        CourseClassName = $"LT {subjectCode} {i + 1}",
                        Index = globalIndex++,
                        Stage = childStage,
                        SessionLengths = subjectScheduleConfig.TheorySessions?.ToList() ?? new List<int>(),
                        NumberStudentsExpected = rand.Next(30, 40),
                        CourseClassType = CourseClassType.Lecture,
                        ParentCourseClassCode = theoryClassCode
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
                                Stage = childStage,
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
        
        public static List<CourseClass> GenerateCourseClasses(string semesterCode, SubjectScheduleConfig config)
        {
            var result = new List<CourseClass>();
            int globalIndex = 1;

            for (int i = 0; i < config.TotalTheoryCourseClass; i++)
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
                };
                result.Add(theoryCourseClass);
                if (config?.PracticeTotalPeriod > 0)
                {
                    for (int p = 0; p < 2; p++)
                    {
                        var labClassCode = $"${semesterCode}_{config.SubjectCode}-TH{i + 1}-{p + 1}";
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
                            NumberStudentsExpected = (new Random()).Next(20, 30)
                        };
                        result.Add(labCourseClass);
                    }
                }
            }
            return result;
        }
    }
    
    
}