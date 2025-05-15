using Education.Contract;
using Education.Core.Repository;
using Education.Core.Specification;
using Google.OrTools.Sat;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Masstransits;

public class GenerateScheduleCreatedHandler(
    ITopicProducer<GenerateScheduleSuccess> successProducer,
    ITopicProducer<GenerateScheduleFail> failProducer,
    IMongoRepository<Room> roomRepository,
    IMongoRepository<StudentRegister> studentRegisterRepository,
    IMongoRepository<SubjectTimelineConfig> subjectTimelineConfigRepository,
    IMongoRepository<CourseClass> courseClassRepository)
    : INotificationHandler<GenerateScheduleCreated>
{
    public async Task Handle(GenerateScheduleCreated notification, CancellationToken cancellationToken)
    {
        var model = new CpModel();
            var solver = new CpSolver();
            var studentRegisters =
                await studentRegisterRepository.FindAsync(
                    new GetStudentRegisterByCorrelationIdSpec(notification.CorrelationId), cancellationToken);
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            
            var list = studentRegisters.Select(c => c.SubjectCodes).ToList();

            var listSubjectCode = new List<string>();
            if (listSubjectCode == null) throw new ArgumentNullException(nameof(listSubjectCode));
            list.ForEach(c => listSubjectCode.AddRange(c));;


            var subjectTimelineConfigs =
                await subjectTimelineConfigRepository.FindAsync(
                    new GetSubjectTimelineBySubjectCodesSpec(listSubjectCode), cancellationToken);
            
            

            var assignmentVars = new Dictionary<(string classId, string roomId, int week, int slotStart), BoolVar>();


            var allClasses = GenerateCourseClasses(studentRegisters,
                subjectTimelineConfigs.Where(c => listSubjectCode.Contains(c.SubjectCode)).ToList());
            // Tạo biến cho mỗi class x room x slot
            foreach (var c in allClasses)
            {
                for (int week = 0; week < 8; week++)
                {
                    foreach (var r in rooms)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var varName = $"class_{c.Id}_room_{r.Id}_week_{week}_slot_{slot}";
                            assignmentVars[(c.Id.ToString(), r.Id.ToString(), week, slot)] = model.NewBoolVar(varName);
                        }
                    }
                }
            }

            foreach (var c in allClasses)
            {
                var vars = new List<BoolVar>();
                for (int week = 0; week < 8; week++)
                {
                    foreach (var r in rooms)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            vars.Add(assignmentVars[(c.Id.ToString(), r.Id.ToString(), week, slot)]);
                        }
                    }
                }
                model.Add(LinearExpr.Sum(vars) == c.Session * c.DurationInWeeks);
            }


            // Ràng buộc: mỗi room-slot chỉ có tối đa 1 lớp
            foreach (var r in rooms)
            {
                for (int week = 0; week < 8; week++)
                {
                    for (int t = 0; t < 12; t++)
                    {
                        var occupyingClasses = new List<BoolVar>();
                        foreach (var c in allClasses)
                        {
                            if (week >= c.DurationInWeeks) continue;
                            for (int start = Math.Max(0, t - c.SessionLength + 1); start <= Math.Min(t, 12 - c.SessionLength); start++)
                            {
                                var key = (c.Id.ToString(), r.Id.ToString(), week, start);
                                if (assignmentVars.TryGetValue(key, out var var))
                                    occupyingClasses.Add(var);
                            }
                        }
                        model.Add(LinearExpr.Sum(occupyingClasses) <= 1);
                    }
                }
            }

            
            
            
            var status = solver.Solve(model);
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                foreach (var c in allClasses)
                {
                    for (int week = 0; week < c.DurationInWeeks; week++)
                    {
                        foreach (var r in rooms)
                        {
                            for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                            {
                                var key = (c.Id.ToString(), r.Id.ToString(), week, slot);
                                if (assignmentVars.TryGetValue(key, out var variable) && solver.Value(variable) == 1)
                                {
                                    var slots = Enumerable.Range(slot, c.SessionLength).ToList();
                                    Console.WriteLine($"✅ Lớp {c.ClassIndex} ({c.CourseClassType}) học ở phòng {r.Name} tuần {week + 1} slot {string.Join(",", slots)}");

                                    // await courseClassRepository.AddAsync(new CourseClass()
                                    // {
                                    //     CorrectionId = notification.CorrelationId,
                                    //     ClassIndex = c.ClassIndex,
                                    //     CourseClassType = c.CourseClassType,
                                    //     SubjectCode = c.SubjectCode,
                                    //     Week = week,
                                    //     Slots = slots.Select(s => s.ToString()).ToList(),
                                    //     RoomCode = r.Code,
                                    //     BuildingCode = r.BuildingCode
                                    // }, cancellationToken);
                                }
                            }
                        }
                    }
                }

            }

            await successProducer.Produce(new { notification.CorrelationId }, cancellationToken);
    }
    
    
    List<CourseClass> GenerateCourseClasses(List<StudentRegister> studentRegisters,
            List<SubjectTimelineConfig> subjectTimelineConfigs)
        {
            var courseClasses = new List<CourseClass>();
            if (courseClasses == null) throw new ArgumentNullException(nameof(courseClasses));
            foreach (var subjectRegister in subjectTimelineConfigs)
            {
                
                var totalStudents = studentRegisters
                    .Count(c => c.SubjectCodes.Contains(subjectRegister.SubjectCode));
                var totalLecture = (int)Math.Ceiling(
                    totalStudents / (double)(subjectRegister.LectureMinStudent == 0
                        ? 1
                        : subjectRegister.LectureMinStudent));
                
                
                var totalLab = (int)Math.Ceiling(
                    totalStudents / (double)(subjectRegister.LabMinStudent == 0 ? 1 : subjectRegister.LabMinStudent));
                if (subjectRegister.LabTotal == 0) totalLab = 0;
                
                Console.WriteLine($"{subjectRegister.SubjectCode} - {totalLecture} - {totalLab} - {totalStudents}" );
                
                for (var i = 0; i < totalLecture; i++)
                {
                    var lectureClass = new CourseClass
                    {
                        ClassIndex = i,
                        CourseClassType = CourseClassType.Lecture,
                        StudentIds = new List<string>(), 
                        SessionLength = 2,
                        SubjectCode = subjectRegister.SubjectCode,
                        Session = 2,
                        DurationInWeeks = 8
                        
                    };
                    courseClasses.Add(lectureClass);
                }
                for (var i = 0; i < totalLab; i++)
                {
                    var labClass = new CourseClass
                    {
                        ClassIndex = i,
                        CourseClassType = CourseClassType.Lab,
                        StudentIds = new List<string>(),
                        SessionLength = 3,
                        SubjectCode = subjectRegister.SubjectCode,
                        Session = 1,
                        DurationInWeeks = 8
                        
                    };
                    courseClasses.Add(labClass);
                }
                
                
            }
            return courseClasses;
        }
    
}