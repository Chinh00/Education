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
    IMongoRepository<CourseClass> courseClassRepository,
    IMongoRepository<SlotTimeline> scheduleRepository)
    : INotificationHandler<GenerateScheduleCreated>
{
    public async Task Handle(GenerateScheduleCreated notification, CancellationToken cancellationToken)
    {
        var model = new CpModel();
            var solver = new CpSolver()
            {
                // max_time_in_seconds:60.0 
                StringParameters = "log_search_progress:true num_search_workers:8 interleave_search:true"
            };

            var studentRegisters =
                await studentRegisterRepository.FindAsync(
                    new GetStudentRegisterByCorrelationIdSpec(notification.CorrelationId), cancellationToken);
            var rooms =
                (await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken)).Slice(0, 1);

            var list = studentRegisters.Select(c => c.SubjectCodes).ToList();

            var listSubjectCode = new List<string>();
            if (listSubjectCode == null) throw new ArgumentNullException(nameof(listSubjectCode));
            list.ForEach(c => listSubjectCode.AddRange(c));
            ;


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

                model.Add(LinearExpr.Sum(vars) == c.Session);
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
                            for (int s = Math.Max(0, slot - c.SessionLength + 1);
                                 s <= Math.Min(slot, 12 - c.SessionLength + 1);
                                 s++)
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
                int minDistance = c.MinDaySpaceLesson;
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
                var listClass = new List<CourseClass>();
                var listTimeLine = new List<SlotTimeline>();
                foreach (var c in allClasses)
                {
                    var courseClassCode = $"{c.SubjectCode}_{c.CourseClassType}_{c.ClassIndex}";
                    var courseClass = new CourseClass()
                    {
                        CorrectionId = notification.CorrelationId,
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
                                    listTimeLine.Add(new SlotTimeline()
                                    {
                                        CourseClassCode = courseClassCode,
                                        RoomCode = r.Code,
                                        BuildingCode = r.BuildingCode,
                                        DayOfWeek = day,
                                        Slots = slots.Select(e => e.ToString()).ToList()
                                    });
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

                    listClass.Add(courseClass);
                }
                await AssignStudentsToClasses(studentRegisters, listClass, listTimeLine);;
            }

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




        async Task AssignStudentsToClasses(
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

                for (int i = 0; i < classPairs.Count; i++)
                {
                    var c1 = classPairs[i];
                    if (!classTimelines.TryGetValue(allClasses.First(c => c.Id.ToString() == c1.classId).CourseClassCode, out var t1)) continue;

                    for (int j = i + 1; j < classPairs.Count; j++)
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
                        cc.StudentIds.Add(studentId);
                    }
                }

                foreach (var courseClass in allClasses)
                {
                    Console.WriteLine(courseClass.StudentIds.Count + " - " + courseClass.SubjectCode + " - " + courseClass.CourseClassType + " - " + courseClass.ClassIndex);
                    await courseClassRepository.AddAsync(courseClass, CancellationToken.None);
                }
            }
            else
            {
                Console.WriteLine("❌ Không thể xếp sinh viên vào lớp (không tìm được phương án thỏa mãn)");
            }
            
            
        }
    
}