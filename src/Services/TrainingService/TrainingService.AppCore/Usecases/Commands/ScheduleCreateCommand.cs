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
            var rooms = (await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken)).Slice(0, 5);

            var list = studentRegisters.Select(c => c.SubjectCodes).ToList();

            var listSubjectCode = new List<string>();
            if (listSubjectCode == null) throw new ArgumentNullException(nameof(listSubjectCode));
            list.ForEach(c => listSubjectCode.AddRange(c));
            
            var subjectTimelineConfigs =
                await subjectTimelineConfigRepository.FindAsync(
                    new GetSubjectTimelineBySubjectCodesSpec(listSubjectCode), cancellationToken);


            var allClasses = GenerateCourseClasses(studentRegisters,
                subjectTimelineConfigs.Where(c => listSubjectCode.Contains(c.SubjectCode)).ToList());
        
            var classDayVars = new Dictionary<(int, int), IntVar>();
            var classSlotVars = new Dictionary<(int, int), IntVar>();
            var classRoomVars = new Dictionary<(int, int), IntVar>();
            var classIntervals = new Dictionary<(int, int), IntervalVar>();

            for (var i = 0; i < allClasses.Count; i++)
            {
                for (var j = 0; j < allClasses[i].Session; j++)
                {
                    var day = model.NewIntVar(0, 5, $"day_c{i}_s{j}");
                    var start = model.NewIntVar(0, 12 - allClasses[i].SessionLength, $"start_c{i}_s{j}");
                    var interval = model.NewIntervalVar(start, allClasses[i].SessionLength, start + allClasses[i].SessionLength, $"interval_c{i}_s{j}");
                    var room = model.NewIntVar(0, rooms.Count - 1, $"room_c{i}_s{j}");
                    classDayVars[(i, j)] = day;
                    classSlotVars[(i, j)] = start;
                    classIntervals[(i, j)] = interval;
                    classRoomVars[(i, j)] = room;
                }
            }

            for (var r = 0; r < rooms.Count; r++)
            {
                var intervalsInRoom = new List<IntervalVar>();
                for (var i = 0; i < allClasses.Count; i++)
                {
                    for (var j = 0; j < allClasses[i].Session; j++)
                    {
                        var roomVar = classRoomVars[(i, j)];
                        var interval = classIntervals[(i, j)];

                        var isInRoom = model.NewBoolVar($"is_class{i}_session{j}_in_room{r}");

                        model.Add(roomVar == r).OnlyEnforceIf(isInRoom);
                        model.Add(roomVar != r).OnlyEnforceIf(isInRoom.Not());
                        var optionalInterval = model.NewOptionalIntervalVar(
                            classSlotVars[(i, j)],
                            allClasses[i].SessionLength,
                            classSlotVars[(i, j)] + allClasses[i].SessionLength,
                            isInRoom,
                            $"opt_interval_c{i}_s{j}_r{r}"
                        );
                        intervalsInRoom.Add(optionalInterval);
                    }
                }
                model.AddNoOverlap(intervalsInRoom);
            }
            
            // for (int i = 0; i < allClasses.Count; i++)
            // {
            //     var sessionCount = allClasses[i].Session;
            //     for (int j1 = 0; j1 < sessionCount; j1++)
            //     {
            //         for (int j2 = j1 + 1; j2 < sessionCount; j2++)
            //         {
            //             var day1 = classDayVars[(i, j1)];
            //             var day2 = classDayVars[(i, j2)];
            //
            //             var diff = model.NewIntVar(-5, 5, $"day_diff_c{i}_s{j1}_s{j2}");
            //             model.Add(diff == day1 - day2);
            //
            //             var absDiff = model.NewIntVar(0, 5, $"abs_day_diff_c{i}_s{j1}_s{j2}");
            //             model.AddAbsEquality(absDiff, diff);
            //
            //             model.Add(absDiff >= 3);
            //         }
            //     }
            // }

            
            
            
            








            var status = solver.Solve(model);
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                for (var i = 0; i < allClasses.Count; i++)
                {
                    Console.WriteLine($"Subject {allClasses[i].SubjectCode} Type {allClasses[i].CourseClassType} Class {allClasses[i].ClassIndex}:");
                    for (var j = 0; j < allClasses[i].Session; j++)
                    {
                        var day = (int)solver.Value(classDayVars[(i, j)]);
                        var start = (int)solver.Value(classSlotVars[(i, j)]);
                        var room = (int)solver.Value(classRoomVars[(i, j)]);
                        Console.WriteLine($"  Session {j + 1}: Day {day}, StartSlot {start}, Duration {allClasses[i].SessionLength} Room {room}");
                    }
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
                        SessionLength = subjectRegister.LecturePeriod,
                        SubjectCode = subjectRegister.SubjectCode,
                        DurationInWeeks = subjectRegister.DurationInWeeks,
                        MinDaySpaceLesson = subjectRegister.MinDaySpaceLecture,
                        Session = subjectRegister.LectureLesson,
                        Stage = subjectRegister.Stage,
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
                        SessionLength = subjectRegister.LabPeriod,
                        SubjectCode = subjectRegister.SubjectCode,
                        DurationInWeeks = subjectRegister.DurationInWeeks,
                        MinDaySpaceLesson = subjectRegister.MinDaySpaceLab,
                        Session = subjectRegister.LabLesson,
                        Stage = subjectRegister.Stage,
                    };
                    courseClasses.Add(labClass);
                }
                
                
            }
            return courseClasses;
        }




        public void AssignStudentsToClasses(
            List<StudentRegister> studentRegisters,
            List<CourseClass> allClasses,
            List<SlotTimeline> timelines)
        {
            var model = new CpModel();
            var solver = new CpSolver { StringParameters = "num_search_workers:8" };

            var assignVars = new Dictionary<(string studentId, string classId), BoolVar>();
            
            var classTimelines = timelines
                .GroupBy(t => t.CourseClassCode)
                .ToDictionary(g => g.Key, g => g.ToList());
            foreach (var student in studentRegisters)
            {
                foreach (var subjectCode in student.SubjectCodes)
                {
                    // Các lớp của môn đó
                    var lectureClasses = allClasses
                        .Where(c => c.SubjectCode == subjectCode && c.CourseClassType == CourseClassType.Lecture)
                        .ToList();

                    var labClasses = allClasses
                        .Where(c => c.SubjectCode == subjectCode && c.CourseClassType == CourseClassType.Lab)
                        .ToList();

                    // 1 lớp lý thuyết
                    var lectureAssigns = new List<BoolVar>();
                    foreach (var cls in lectureClasses)
                    {
                        var varKey = (student.StudentCode, cls.Id.ToString());
                        assignVars[varKey] = model.NewBoolVar($"student_{student.Id}_lecture_{cls.Id}");
                        lectureAssigns.Add(assignVars[varKey]);
                    }
                    model.Add(LinearExpr.Sum(lectureAssigns) == 1);

                    // 1 lớp thực hành (nếu có)
                    if (labClasses.Count > 0)
                    {
                        var labAssigns = new List<BoolVar>();
                        foreach (var cls in labClasses)
                        {
                            var varKey = (student.StudentCode, cls.Id.ToString());
                            assignVars[varKey] = model.NewBoolVar($"student_{student.Id}_lab_{cls.Id}");
                            labAssigns.Add(assignVars[varKey]);
                        }
                        model.Add(LinearExpr.Sum(labAssigns) == 1);
                    }
                }
            }
            
            foreach (var student in studentRegisters)
            {
                var classPairs = assignVars.Keys
                    .Where(k => k.studentId == student.StudentCode)
                    .ToList();
            
                for (var i = 0; i < classPairs.Count; i++)
                {
                    var c1 = classPairs[i];
                    if (!classTimelines.TryGetValue(allClasses.First(c => c.Id.ToString() == c1.classId).CourseClassCode, out var t1)) continue;
            
                    for (var j = i + 1; j < classPairs.Count; j++)
                    {
                        var c2 = classPairs[j];
                        if (!classTimelines.TryGetValue(allClasses.First(c => c.Id.ToString() == c2.classId).CourseClassCode, out var t2)) continue;
            
                        // Check trùng thời gian giữa 2 lớp
                        foreach (var t1item in t1)
                        {
                            foreach (var t2item in t2)
                            {
                                if (t1item.DayOfWeek == t2item.DayOfWeek &&
                                    t1item.Slots.Intersect(t2item.Slots).Any())
                                {
                                    var v1 = assignVars[c1];
                                    var v2 = assignVars[c2];
                                    model.Add(v1 + v2 <= 1); // không chọn cả hai lớp nếu trùng giờ
                                }
                            }
                        }
                    }
                }
            }
            var status = solver.Solve(model);

            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                foreach (var ((studentId, classId), variable) in assignVars)
                {
                    if (solver.Value(variable) == 1)
                    {
                        var cc = allClasses.First(c => c.Id.ToString() == classId);
                        Console.WriteLine($"📘 Sinh viên {studentId} được xếp vào lớp {cc.SubjectCode} ({cc.CourseClassType}) - ClassIndex {cc.ClassIndex}");
                    }
                }
            }
            else
            {
                Console.WriteLine("❌ Không thể xếp sinh viên vào lớp (không tìm được phương án thỏa mãn)");
            }
            
            
        }
        

    }
}