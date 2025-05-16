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
        IMongoRepository<SubjectTimelineConfig> subjectTimelineConfigRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> scheduleRepository)
        : IRequestHandler<ScheduleCreateCommand, IResult>
    {
        public async Task<IResult> Handle(ScheduleCreateCommand request, CancellationToken cancellationToken)
        {
            var model = new CpModel();
            var solver = new CpSolver()
            {
                // max_time_in_seconds:60.0 
                StringParameters = "log_search_progress:true num_search_workers:8 interleave_search:true"
            };
            
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
            
            

            var assignmentVars = new Dictionary<(string classId, string roomId, int day, int slotStart), BoolVar>();


            var allClasses = GenerateCourseClasses(studentRegisters,
                subjectTimelineConfigs.Where(c => listSubjectCode.Contains(c.SubjectCode)).ToList());
            
            foreach (var c in allClasses)
            {
                foreach (var r in rooms)
                {
                    for (int day = 0; day < 6; day++)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var varName = $"class_{c.Id}_room_{r.Id}_slot_{slot}";
                            assignmentVars[(c.Id.ToString(), r.Id.ToString(), day, slot)] = model.NewBoolVar(varName);
                        }
                    }
                }
            }
            
            
            // Rằng buộcố buổi trên tuần
            foreach (var c in allClasses)
            {
                var vars = new List<BoolVar>();
                foreach (var r in rooms)
                {
                    for (int day = 0; day < 6; day++)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            vars.Add(assignmentVars[(c.Id.ToString(), r.Id.ToString(), day, slot)]);
                        }
                    }
                }
                model.Add(LinearExpr.Sum(vars) == c.SessionLength);
            }
            // Không trùng giờ giữa các phòng
            for (int day = 0; day < 6; day++)
            {
                for (int slot = 0; slot < 12; slot++)  
                {
                    foreach (var room in rooms)
                    {
                        var occupiedVars = new List<BoolVar>();
            
                        foreach (var c in allClasses)
                        {
                            for (int s = Math.Max(0, slot - c.SessionLength + 1); s <= Math.Min(slot, 12 - c.SessionLength + 1); s++)
                            {
                                // Nếu lớp này bắt đầu từ s và kéo dài c.SessionLength thì nó chiếm tiết `slot`
                                if (s + c.SessionLength - 1 >= slot)
                                {
                                    var key = (c.Id.ToString(), room.Id.ToString(), day, s);
                                    if (assignmentVars.TryGetValue(key, out var v))
                                    {
                                        occupiedVars.Add(v);
                                    }
                                }
                            }
                        }
            
                        model.Add(LinearExpr.Sum(occupiedVars) <= 1);
                    }
                }
            }
            
            foreach (var c in allClasses)
            {
                for (int day = 0; day < 6; day++)
                {
                    var dayVars = new List<BoolVar>();
            
                    foreach (var room in rooms)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var key = (c.Id.ToString(), room.Id.ToString(), day, slot);
                            if (assignmentVars.TryGetValue(key, out var v))
                            {
                                dayVars.Add(v);
                            }
                        }
                    }
            
                    // Không được học nhiều hơn 1 buổi trong cùng một ngày
                    model.Add(LinearExpr.Sum(dayVars) <= 1);
                }
            }
            foreach (var c in allClasses)
            {
                var classDayVars = new List<BoolVar>();
            
                for (int day = 0; day < 6; day++)
                {
                    var varsInDay = new List<BoolVar>();
            
                    foreach (var r in rooms)
                    {
                        for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                        {
                            var key = (c.Id.ToString(), r.Id.ToString(), day, slot);
                            if (assignmentVars.TryGetValue(key, out var v))
                            {
                                varsInDay.Add(v);
                            }
                        }
                    }
            
                    var dayVar = model.NewBoolVar($"class_{c.Id}_active_day_{day}");
                    model.Add(LinearExpr.Sum(varsInDay) >= 1).OnlyEnforceIf(dayVar);
                    model.Add(LinearExpr.Sum(varsInDay) == 0).OnlyEnforceIf(dayVar.Not());
                    classDayVars.Add(dayVar);
                }
            
                // Ràng buộc khoảng cách tối thiểu
                int minDistance = 2; // Tối thiểu cách nhau 2 ngày
                for (int d1 = 0; d1 < 6; d1++)
                {
                    for (int d2 = d1 + 1; d2 < 6; d2++)
                    {
                        if (Math.Abs(d2 - d1) < minDistance)
                        {
                            model.Add(classDayVars[d1] + classDayVars[d2] <= 1);
                        }
                    }
                }
            }


            
            var status = solver.Solve(model);
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                // var listClass = new List<CourseClass>();
                foreach (var c in allClasses)
                {
                    var courseClassCode = $"{c.SubjectCode}_{c.CourseClassType}_{c.ClassIndex}";
                    var courseClass = new CourseClass()
                    {
                        CorrectionId = Guid.Parse(request.CorrelationId),
                        ClassIndex = c.ClassIndex,
                        CourseClassType = c.CourseClassType,
                        SubjectCode = c.SubjectCode,
                        DurationInWeeks = c.DurationInWeeks,
                        SessionLength = c.SessionLength,
                        CourseClassCode = courseClassCode
                    };
                    foreach (var r in rooms)
                    {
                        for (int day = 0; day < 6; day++)
                        {
                            for (int slot = 0; slot <= 12 - c.SessionLength; slot++)
                            {
                                var key = (c.Id.ToString(), r.Id.ToString(), day, slot);
                                if (assignmentVars.TryGetValue(key, out var variable) && solver.Value(variable) == 1)
                                {
                                    var slots = Enumerable.Range(slot, c.SessionLength).ToList();
                                    Console.WriteLine(
                                        $"✅ Môn {c.SubjectCode} Lớp {c.ClassIndex} ({c.CourseClassType}) học ở phòng {r.Name} ngày {day} slot {string.Join(",", slots)}");
                                    await scheduleRepository.AddAsync(new SlotTimeline()
                                    {
                                        CourseClassCode = courseClassCode,
                                        RoomCode = r.Code,
                                        BuildingCode = r.BuildingCode,
                                        DayOfWeek = day,
                                        Slots = slots.Select(e => e.ToString()).ToList()
                                    }, cancellationToken);
                                }
                            }
                        }
                    }

                    await courseClassRepository.AddAsync(courseClass, cancellationToken);

                }

            }

            return Results.BadRequest("Không thể xếp lịch học");
        }
        // Tạo lớp dựa trên số sinh viên đã đăng ký nguyện vọng 
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
                        SessionLength = subjectRegister.LectureLesson,
                        SubjectCode = subjectRegister.SubjectCode,
                        DurationInWeeks = subjectRegister.DurationInWeeks,
                        MinDaySpaceLesson = subjectRegister.MinDaySpaceLecture
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
                        SessionLength = subjectRegister.LabLesson,
                        SubjectCode = subjectRegister.SubjectCode,
                        DurationInWeeks = subjectRegister.DurationInWeeks,
                        MinDaySpaceLesson = subjectRegister.MinDaySpaceLab
                    };
                    courseClasses.Add(labClass);
                }
                
                
            }
            return courseClasses;
        }
    }
}