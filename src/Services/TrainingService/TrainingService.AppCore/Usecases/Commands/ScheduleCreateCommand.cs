using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using Google.OrTools.Sat;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record ScheduleCreateCommand(string CorrelationId) : ICommand<IResult>
{
    internal class Handler(
        IMongoRepository<Room> roomRepository,
        IMongoRepository<StudentRegister> studentRegisterRepository,
        IMongoRepository<SubjectTimelineConfig> subjectTimelineConfigRepository)
        : IRequestHandler<ScheduleCreateCommand, IResult>
    {
        public async Task<IResult> Handle(ScheduleCreateCommand request, CancellationToken cancellationToken)
        {
            var model = new CpModel();
            var solver = new CpSolver();
            var studentRegisters =
                await studentRegisterRepository.FindAsync(
                    new GetStudentRegisterByCorrelationIdSpec(Guid.Parse(request.CorrelationId)), cancellationToken);
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            
            var list = studentRegisters.Select(c => c.SubjectCodes).ToList();

            var listSubjectCode = new List<string>();
            if (listSubjectCode == null) throw new ArgumentNullException(nameof(listSubjectCode));
            list.ForEach(c => listSubjectCode.AddRange(c));;


            var subjectTimelineConfigs =
                await subjectTimelineConfigRepository.FindAsync(
                    new GetSubjectTimelineBySubjectCodesSpec(listSubjectCode), cancellationToken);
            
            
            
            // // Xây dựng lịch cho mỗi lớp học với phòng
            // Dictionary<string, List<IntVar>> roomSchedule = new();
            // foreach (var room in rooms)
            // {
            //     var roomSlots = new List<IntVar>();
            //     for (int t = 0; t < 12; t++)
            //     {
            //         roomSlots.Add(model.NewBoolVar($"room_{room.Id}_slot_{t}"));
            //     }
            //     roomSchedule[room.Id.ToString()] = roomSlots;
            // }

            var assignmentVars = new Dictionary<(string classId, string roomId, int slot), BoolVar>();


            var allClasses = GenerateCourseClasses(studentRegisters,
                subjectTimelineConfigs.Where(c => listSubjectCode.Contains(c.SubjectCode)).ToList());
            // Tạo biến cho mỗi class x room x slot
            foreach (var c in allClasses)
            {
                foreach (var r in rooms)
                {
                    for (int slot = 0; slot < 12; slot++)
                    {
                        var varName = $"class_{c.Id}_room_{r.Id}_slot_{slot}";
                        var boolVar = model.NewBoolVar(varName);
                        assignmentVars[(c.Id.ToString(), r.Id.ToString(), slot)] = boolVar;
                    }
                }
            }

            // Ràng buộc: mỗi lớp phải được gán đúng 1 room-slot
            foreach (var c in allClasses)
            {
                var vars = new List<BoolVar>();
                foreach (var r in rooms)
                {
                    for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                    {
                        vars.Add(assignmentVars[(c.Id.ToString(), r.Id.ToString(), slot)]);
                    }
                }
                model.Add(LinearExpr.Sum(vars) == 1);
            }

            // Ràng buộc: mỗi room-slot chỉ có tối đa 1 lớp
            foreach (var r in rooms)
            {
                for (int t = 0; t < 12; t++)
                {
                    var occupyingClasses = new List<BoolVar>();

                    foreach (var c in allClasses)
                    {
                        for (int start = 0; start <= 12 - c.SessionLength; start++)
                        {
                            // Nếu lớp này chiếm từ slot start đến start + SessionLength - 1
                            if (t >= start && t < start + c.SessionLength)
                            {
                                var key = (c.Id.ToString(), r.Id.ToString(), start);
                                if (assignmentVars.ContainsKey(key))
                                    occupyingClasses.Add(assignmentVars[key]);
                            }
                        }
                    }

                    model.Add(LinearExpr.Sum(occupyingClasses) <= 1);
                }
            }

            
            // foreach (var room in rooms)
            // {
            //     for (int slot = 0; slot < 12; slot++)
            //     {
            //         var roomSlotAssignments = new List<IntVar>();
            //
            //         foreach (var c in allClasses)
            //         {
            //             var key = (c.ClassIndex, room.Id, slot);
            //             if (classAssignments.ContainsKey(key.to))
            //             {
            //                 roomSlotAssignments.Add(classAssignments[key]);
            //             }
            //         }
            //
            //         // Mỗi phòng tại 1 slot chỉ có tối đa 1 lớp
            //         model.Add(LinearExpr.Sum(roomSlotAssignments) <= 1);
            //     }
            // }
            
            
            var status = solver.Solve(model);
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                foreach (var c in allClasses)
                {
                    foreach (var r in rooms)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var key = (c.Id.ToString(), r.Id.ToString(), slot);
                            if (assignmentVars.TryGetValue(key, out var variable) && solver.Value(variable) == 1)
                            {
                                var slots = Enumerable.Range(slot, c.SessionLength).ToList();
                                Console.WriteLine($"✅ Lớp {c.ClassIndex} ({c.CourseClassType}) học ở phòng {r.Name} slot {string.Join(",", slots)}");
                            }
                        }
                    }
                }

                return Results.Ok(status);
            }

            return Results.BadRequest("Không thể xếp lịch học");
        }
        // Tạo lớp dựa trên số sinh viên đã đăng ký nguyện vọng 
        List<CourseClass> GenerateCourseClasses(List<StudentRegister> studentRegisters,
            List<SubjectTimelineConfig> subjectTimelineConfigs)
        {
            Console.WriteLine(subjectTimelineConfigs.Count);
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
                        SessionLength = 2
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
                        SessionLength = 3
                    };
                    courseClasses.Add(labClass);
                }
                
                
            }
            return courseClasses;
        }
    }
}