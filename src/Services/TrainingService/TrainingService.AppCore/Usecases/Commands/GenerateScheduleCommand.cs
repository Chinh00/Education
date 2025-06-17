using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using Google.OrTools.Sat;
using MediatR;
using MongoDB.Bson;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public class GenerateScheduleCommand : ICommand<IResult>
{
    internal class Handler(
        IMongoRepository<Subject> subjectRepository,
        IMongoRepository<Room> roomRepository,
        IMongoRepository<SubjectRegister> subjectRegisterRepository,
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository
    ) : IRequestHandler<GenerateScheduleCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
        {
            var subjects = (await subjectRepository.FindAsync(new TrueListSpecification<Subject>(), cancellationToken)).Slice(0, 5);
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            var subjectScheduleConfigs = GetSampleData();

            var courseClasses = GenerateCourseClasses(subjectScheduleConfigs);

            var allRooms = rooms.ToList();
            var allRoomCodes = allRooms.Select(r => r.Code).Where(code => !string.IsNullOrEmpty(code)).ToList();
            int totalDays = 6;
            int periodsPerDay = 12;

            int minDaysBetweenTheorySessions = 2;
            int minDaysBetweenLabSessions = 1;

            // Giờ nghỉ trưa: sau tiết 6 (tức 6 và 7 không được liên tiếp cho 1 lớp)
            int lunchBreakStart = 6;
            int lunchBreakEnd = 7;

            var roomDayPeriod = new Dictionary<string, bool[,]>();
            foreach (var room in allRoomCodes) roomDayPeriod[room] = new bool[totalDays, periodsPerDay];

            var assignments = new List<object>();
            var parentUsedDays = new Dictionary<string, HashSet<int>>();
            var rng = new Random();

            var subjectDayCount = new Dictionary<string, int[]>();
            var subjectPeriodCount = new Dictionary<string, int[,]>(); // [day, startPeriod] = count
            int maxSubjectClassPerDay = 1;
            int maxSubjectClassPerPeriod = 2;

            foreach (var subjectConfig in subjectScheduleConfigs)
            {
                subjectDayCount[subjectConfig.SubjectCode] = new int[totalDays];
                subjectPeriodCount[subjectConfig.SubjectCode] = new int[totalDays, periodsPerDay];
            }

            var roomMap = allRooms.ToDictionary(r => r.Code, r => r);

            var scheduledLabSessions = new Dictionary<string, List<(string, int, string, int, int)>>();

            foreach (var courseClass in courseClasses)
            {
                var sessionList = new List<object>();
                var parentCode = courseClass.CourseClassType == CourseClassType.Lab
                    ? courseClass.ParentCourseClassCode
                    : courseClass.CourseClassCode;

                if (!parentUsedDays.ContainsKey(parentCode))
                    parentUsedDays[parentCode] = new HashSet<int>();

                if (courseClass.CourseClassType == CourseClassType.Lab && !scheduledLabSessions.ContainsKey(parentCode))
                    scheduledLabSessions[parentCode] = new List<(string, int, string, int, int)>();

                var usedDays = new HashSet<int>();
                var subjectConfig = subjectScheduleConfigs.FirstOrDefault(cfg => cfg.SubjectCode == courseClass.SubjectCode);
                int sessionPriority = subjectConfig?.SessionPriority ?? -1;

                for (int sessionIdx = 0; sessionIdx < courseClass.SessionLengths.Count; sessionIdx++)
                {
                    int sessionLen = courseClass.SessionLengths[sessionIdx];
                    bool assigned = false;

                    // Lấy điều kiện phòng yêu cầu cho lớp này
                    List<string> requiredConditions = courseClass.CourseClassType == CourseClassType.Lab
                        ? subjectConfig.LabRequiredConditions
                        : subjectConfig.LectureRequiredConditions;

                    // Lọc danh sách phòng theo điều kiện phòng
                    var filteredRooms = allRoomCodes
                        .Where(roomCode =>
                        {
                            var room = roomMap[roomCode];
                            // Điều kiện sức chứa
                            if (courseClass.NumberStudentsExpected > room.Capacity)
                                return false;
                            // Điều kiện loại phòng
                            if (requiredConditions != null && requiredConditions.Count > 0)
                            {
                                // Giả sử room.RoomConditions là List<string>
                                if (room.SupportedConditions == null || !requiredConditions.All(cond => room.SupportedConditions.Contains(cond)))
                                    return false;
                            }
                            return true;
                        })
                        .OrderBy(x => rng.Next())
                        .ToList();

                    var dayCounts = subjectDayCount[courseClass.SubjectCode];
                    var periodCounts = subjectPeriodCount[courseClass.SubjectCode];

                    // === ƯU TIÊN LAB LIỀN KỀ ===
                    bool preferAdjacentLab = false;
                    int preferredDay = -1, preferredStart = -1;
                    string preferredRoom = null;
                    if (courseClass.CourseClassType == CourseClassType.Lab && scheduledLabSessions[parentCode].Count == 1)
                    {
                        var firstLab = scheduledLabSessions[parentCode][0];
                        int firstDay = firstLab.Item2;
                        string firstRoom = firstLab.Item3;
                        int firstStart = firstLab.Item4;
                        int firstLen = firstLab.Item5;

                        // Chỉ ưu tiên nếu phòng thực hành thứ 2 cũng thỏa mãn điều kiện phòng
                        if (filteredRooms.Contains(firstRoom))
                        {
                            // Thử liền sau
                            int afterStart = firstStart + firstLen;
                            if (afterStart + sessionLen <= periodsPerDay
                                && !(firstStart + firstLen == lunchBreakStart && sessionLen > 0))
                            {
                                bool can = true;
                                for (int p = 0; p < sessionLen; p++)
                                {
                                    int slotIdx = afterStart + p;
                                    if (slotIdx == lunchBreakStart) { can = false; break; }
                                    if (roomDayPeriod[firstRoom][firstDay, slotIdx] ||
                                        periodCounts[firstDay, slotIdx] >= maxSubjectClassPerPeriod)
                                    {
                                        can = false;
                                        break;
                                    }
                                }
                                // Kiểm tra không có cặp 6-7 liền nhau (áp dụng cho mọi lớp)
                                if (can)
                                {
                                    bool has67 = false;
                                    for (int p = 0; p < sessionLen - 1; p++)
                                    {
                                        if ((afterStart + p == lunchBreakStart - 1) && (afterStart + p + 1 == lunchBreakStart))
                                        {
                                            has67 = true;
                                            break;
                                        }
                                    }
                                    if (!has67)
                                    {
                                        preferAdjacentLab = true;
                                        preferredDay = firstDay;
                                        preferredRoom = firstRoom;
                                        preferredStart = afterStart;
                                    }
                                }
                            }
                            // Thử liền trước
                            if (!preferAdjacentLab)
                            {
                                int beforeStart = firstStart - sessionLen;
                                if (beforeStart >= 0
                                    && !(beforeStart + sessionLen - 1 == lunchBreakStart - 1 && sessionLen > 0))
                                {
                                    bool can = true;
                                    for (int p = 0; p < sessionLen; p++)
                                    {
                                        int slotIdx = beforeStart + p;
                                        if (slotIdx == lunchBreakStart) { can = false; break; }
                                        if (roomDayPeriod[firstRoom][firstDay, slotIdx] ||
                                            periodCounts[firstDay, slotIdx] >= maxSubjectClassPerPeriod)
                                        {
                                            can = false;
                                            break;
                                        }
                                    }
                                    // Kiểm tra không có cặp 6-7 liền nhau (áp dụng cho mọi lớp)
                                    if (can)
                                    {
                                        bool has67 = false;
                                        for (int p = 0; p < sessionLen - 1; p++)
                                        {
                                            if ((beforeStart + p == lunchBreakStart - 1) && (beforeStart + p + 1 == lunchBreakStart))
                                            {
                                                has67 = true;
                                                break;
                                            }
                                        }
                                        if (!has67)
                                        {
                                            preferAdjacentLab = true;
                                            preferredDay = firstDay;
                                            preferredRoom = firstRoom;
                                            preferredStart = beforeStart;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Nếu có ưu tiên liền kề, thực hiện luôn và bỏ qua các bước chọn ngày/phòng
                    if (preferAdjacentLab)
                    {
                        for (int p = 0; p < sessionLen; p++)
                        {
                            roomDayPeriod[preferredRoom][preferredDay, preferredStart + p] = true;
                            periodCounts[preferredDay, preferredStart + p]++;
                        }
                        usedDays.Add(preferredDay);
                        parentUsedDays[parentCode].Add(preferredDay);
                        dayCounts[preferredDay]++;
                        scheduledLabSessions[parentCode].Add((courseClass.CourseClassCode, preferredDay, preferredRoom, preferredStart, sessionLen));
                        sessionList.Add(new
                        {
                            DayOfWeek = preferredDay + 2,
                            StartPeriod = preferredStart, // slot bắt đầu từ 0
                            Periods = sessionLen,
                            RoomCode = preferredRoom
                        });

                        // Lưu SlotTimeline
                        var slotList = new List<string>();
                        for (int p = 0; p < sessionLen; p++)
                        {
                            slotList.Add((preferredStart + p).ToString()); // slot bắt đầu từ 0
                        }
                        var roomObj = preferredRoom != null && roomMap.ContainsKey(preferredRoom) ? roomMap[preferredRoom] : null;
                        await slotTimelineRepository.AddAsync(new SlotTimeline
                        {
                            CourseClassCode = courseClass.CourseClassCode,
                            BuildingCode = roomObj?.BuildingCode,
                            RoomCode = preferredRoom,
                            DayOfWeek = preferredDay,
                            Slots = slotList
                        }, cancellationToken);

                        assigned = true;
                    }
                    else
                    {
                        var validDays = Enumerable.Range(0, totalDays)
                            .Where(day =>
                                !usedDays.Contains(day)
                                && !parentUsedDays[parentCode].Contains(day)
                                && ((courseClass.CourseClassType == CourseClassType.Lab)
                                    ? !usedDays.Any(d => Math.Abs(d - day) < minDaysBetweenLabSessions)
                                    : !usedDays.Any(d => Math.Abs(d - day) < minDaysBetweenTheorySessions))
                                && dayCounts[day] < maxSubjectClassPerDay
                            ).ToList();

                        if (!validDays.Any())
                        {
                            validDays = Enumerable.Range(0, totalDays)
                                .Where(day =>
                                    !usedDays.Contains(day)
                                    && !parentUsedDays[parentCode].Contains(day)
                                    && ((courseClass.CourseClassType == CourseClassType.Lab)
                                        ? !usedDays.Any(d => Math.Abs(d - day) < minDaysBetweenLabSessions)
                                        : !usedDays.Any(d => Math.Abs(d - day) < minDaysBetweenTheorySessions))
                                ).ToList();
                        }

                        validDays = validDays.OrderBy(day => dayCounts[day]).ToList();

                        string assignedRoomCode = null;
                        int assignedDay = -1;
                        int assignedStartPeriod = -1;

                        foreach (var roomCode in filteredRooms)
                        {
                            var room = roomMap[roomCode];

                            foreach (var day in validDays)
                            {
                                List<int> startPeriodOrder;
                                if (sessionPriority == 0)
                                    startPeriodOrder = Enumerable.Range(0, periodsPerDay - sessionLen + 1).ToList();
                                else if (sessionPriority == 1)
                                    startPeriodOrder = Enumerable.Range(0, periodsPerDay - sessionLen + 1).Reverse().ToList();
                                else
                                    startPeriodOrder = Enumerable.Range(0, periodsPerDay - sessionLen + 1).OrderBy(x => rng.Next()).ToList();

                                foreach (var startPeriod in startPeriodOrder)
                                {
                                    // KHÔNG CẮT NGANG NGHỈ TRƯA
                                    bool violateLunch = false;
                                    for (int p = 0; p < sessionLen; p++)
                                    {
                                        int slotIdx = startPeriod + p;
                                        if (slotIdx == lunchBreakStart)
                                        {
                                            violateLunch = true;
                                            break;
                                        }
                                    }
                                    if (violateLunch) continue;

                                    // KHÔNG XẾP 2 TIẾT 6 7 LIỀN NHAU (mọi lớp)
                                    bool has67 = false;
                                    for (int p = 0; p < sessionLen - 1; p++)
                                    {
                                        if ((startPeriod + p == lunchBreakStart - 1) && (startPeriod + p + 1 == lunchBreakStart))
                                        {
                                            has67 = true;
                                            break;
                                        }
                                    }
                                    if (has67) continue;

                                    // Tránh quá nhiều lớp của cùng 1 môn vào cùng khung giờ
                                    bool violatePeriod = false;
                                    for (int p = 0; p < sessionLen; p++)
                                    {
                                        if (periodCounts[day, startPeriod + p] >= maxSubjectClassPerPeriod)
                                        {
                                            violatePeriod = true;
                                            break;
                                        }
                                    }
                                    if (violatePeriod) continue;

                                    bool canAssign = true;
                                    for (int p = 0; p < sessionLen; p++)
                                    {
                                        if (roomDayPeriod[roomCode][day, startPeriod + p])
                                        {
                                            canAssign = false;
                                            break;
                                        }
                                    }
                                    if (canAssign)
                                    {
                                        for (int p = 0; p < sessionLen; p++)
                                        {
                                            roomDayPeriod[roomCode][day, startPeriod + p] = true;
                                            periodCounts[day, startPeriod + p]++;
                                        }
                                        usedDays.Add(day);
                                        parentUsedDays[parentCode].Add(day);
                                        dayCounts[day]++;
                                        assignedRoomCode = roomCode;
                                        assignedDay = day;
                                        assignedStartPeriod = startPeriod;
                                        if (courseClass.CourseClassType == CourseClassType.Lab)
                                            scheduledLabSessions[parentCode].Add((courseClass.CourseClassCode, day, roomCode, startPeriod, sessionLen));
                                        sessionList.Add(new
                                        {
                                            DayOfWeek = day + 2,
                                            StartPeriod = startPeriod, // slot bắt đầu từ 0
                                            Periods = sessionLen,
                                            RoomCode = roomCode
                                        });
                                        // Lưu SlotTimeline
                                        var slotList = new List<string>();
                                        for (int p = 0; p < sessionLen; p++)
                                        {
                                            slotList.Add((startPeriod + p).ToString()); // slot bắt đầu từ 0
                                        }
                                        var roomObj = roomCode != null && roomMap.ContainsKey(roomCode) ? roomMap[roomCode] : null;
                                        await slotTimelineRepository.AddAsync(new SlotTimeline
                                        {
                                            CourseClassCode = courseClass.CourseClassCode,
                                            BuildingCode = roomObj?.BuildingCode,
                                            RoomCode = roomCode,
                                            DayOfWeek = day,
                                            Slots = slotList
                                        }, cancellationToken);
                                        assigned = true;
                                        break;
                                    }
                                }
                                if (assigned) break;
                            }
                            if (assigned) break;
                        }

                        if (!assigned)
                        {
                            sessionList.Add(new
                            {
                                DayOfWeek = -1,
                                StartPeriod = -1,
                                Periods = sessionLen,
                                RoomCode = "NO_AVAILABLE_ROOM"
                            });
                        }
                    }
                }

                assignments.Add(new
                {
                    CourseClassCode = courseClass.CourseClassCode,
                    CourseClassType = courseClass.CourseClassType.ToString(),
                    Sessions = sessionList
                });

                await courseClassRepository.AddAsync(new CourseClass()
                {
                    CourseClassCode = courseClass.CourseClassCode,
                    CourseClassName = courseClass.CourseClassCode,
                    Stage = SubjectTimelineStage.Stage1,
                    SubjectCode = courseClass.SubjectCode,
                    ParentCourseClassCode = courseClass.ParentCourseClassCode
                }, cancellationToken);
            }

            return Results.Ok(assignments);
        }

        public static List<CourseClass> GenerateCourseClasses(List<SubjectScheduleConfig> configs)
        {
            var result = new List<CourseClass>();
            int globalIndex = 1;

            foreach (var config in configs)
            {
                for (int i = 0; i < config.TotalTheoryCourseClass; i++)
                {
                    var theoryClassCode = $"{config.SubjectCode}-LT{i + 1}";
                    var theoryCourseClass = new CourseClass
                    {
                        SubjectCode = config.SubjectCode,
                        CourseClassCode = theoryClassCode,
                        CourseClassName = $"LT {config.SubjectCode} {i + 1}",
                        Index = globalIndex++,
                        SessionLengths = config.TheorySessions.ToList(),
                        NumberStudentsExpected = (new Random()).Next(30, 40)
                    };
                    result.Add(theoryCourseClass);

                    for (int p = 0; p < 2; p++)
                    {
                        var labClassCode = $"{config.SubjectCode}-TH{i + 1}-{p + 1}";
                        var labCourseClass = new CourseClass
                        {
                            SubjectCode = config.SubjectCode,
                            CourseClassCode = labClassCode,
                            CourseClassName = $"TH {config.SubjectCode} {i + 1}-{p + 1}",
                            Index = globalIndex++,
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

        public static List<SubjectScheduleConfig> GetSampleData()
        {
            return
            [
                new SubjectScheduleConfig
                {
                    SubjectCode = "GEL111",
                    TotalTheoryCourseClass = 7,
                    TotalPracticeCourseClass = 5,
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
                    TotalPracticeCourseClass = 0,
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
                    TotalTheoryCourseClass = 5,
                    TotalPracticeCourseClass = 0,
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
                    TotalTheoryCourseClass = 3,
                    TotalPracticeCourseClass = 0,
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
                    TotalTheoryCourseClass = 3,
                    TotalPracticeCourseClass = 0,
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