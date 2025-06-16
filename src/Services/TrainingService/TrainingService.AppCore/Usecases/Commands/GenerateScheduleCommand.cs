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
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository
    ) : IRequestHandler<GenerateScheduleCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
        {
            var subjects = (await subjectRepository.FindAsync(new TrueListSpecification<Subject>(), cancellationToken)).Slice(0, 5); // giảm số môn để test nhanh
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            var subjectScheduleConfigs = GetSampleData();

            var courseClasses = GenerateCourseClasses(subjectScheduleConfigs);

            var allRooms = rooms.ToList();
            var allRoomCodes = allRooms.Select(r => r.Code).Where(code => !string.IsNullOrEmpty(code)).ToList();
            int totalDays = 6;
            int periodsPerDay = 12;

            // --- Ưu tiên sáng hay chiều ---
            // "sang" để ưu tiên buổi sáng, "chieu" để ưu tiên buổi chiều
            string uuTienBuoi = "chieu";
            // string uuTienBuoi = "chieu"; // Nếu muốn ưu tiên buổi chiều thì bật dòng này

            // Mỗi phòng, mỗi ngày, mỗi tiết: 3 chiều
            // [room][day][period] = CourseClassCode hoặc null
            var roomDayPeriod = new Dictionary<string, bool[,]>(); // [day, period] = đã bị chiếm?
            foreach (var room in allRoomCodes)
            {
                // days 0..5, periods 0..11
                roomDayPeriod[room] = new bool[totalDays, periodsPerDay];
            }

            var assignments = new List<object>();

            var theoryUsedDays = new Dictionary<string, HashSet<int>>(); // key: mã lớp lý thuyết, value: ngày đã dùng

            var rng = new Random();

            foreach (var courseClass in courseClasses)
            {
                var sessionList = new List<object>();
                // Xác định khóa cha, nếu là lý thuyết thì tự là cha
                var parentCode = courseClass.CourseClassType == CourseClassType.Lab
                    ? courseClass.ParentCourseClassCode
                    : courseClass.CourseClassCode;

                if (!theoryUsedDays.ContainsKey(parentCode))
                    theoryUsedDays[parentCode] = new HashSet<int>();

                var usedDays = new HashSet<int>(); // Ngày đã xếp cho chính lớp này (sẽ merge vào theoryUsedDays nếu là lý thuyết)

                for (int sessionIdx = 0; sessionIdx < courseClass.SessionLengths.Count; sessionIdx++)
                {
                    int sessionLen = courseClass.SessionLengths[sessionIdx];
                    bool assigned = false;

                    // Xáo trộn danh sách phòng cho mỗi session để gán phòng ngẫu nhiên
                    var shuffledRooms = allRoomCodes.OrderBy(x => rng.Next()).ToList();

                    foreach (var room in shuffledRooms)
                    {
                        for (int day = 0; day < totalDays; day++)
                        {
                            // Nếu là thực hành: không trùng ngày của lý thuyết cha
                            // Nếu là lý thuyết: không trùng ngày trong usedDays của chính mình
                            if (usedDays.Contains(day) || theoryUsedDays[parentCode].Contains(day)) continue;

                            // --- Ưu tiên startPeriod theo sáng/chiều ---
                            List<int> startPeriodOrder;
                            if (uuTienBuoi == "sang")
                                startPeriodOrder = Enumerable.Range(0, periodsPerDay - sessionLen + 1).ToList();
                            else // ưu tiên chiều
                                startPeriodOrder = Enumerable.Range(0, periodsPerDay - sessionLen + 1).Reverse().ToList();

                            foreach (var startPeriod in startPeriodOrder)
                            {
                                bool canAssign = true;
                                for (int p = 0; p < sessionLen; p++)
                                {
                                    if (roomDayPeriod[room][day, startPeriod + p])
                                    {
                                        canAssign = false;
                                        break;
                                    }
                                }
                                if (canAssign)
                                {
                                    for (int p = 0; p < sessionLen; p++)
                                        roomDayPeriod[room][day, startPeriod + p] = true;

                                    usedDays.Add(day);

                                    sessionList.Add(new
                                    {
                                        DayOfWeek = day + 2,
                                        StartPeriod = startPeriod + 1,
                                        Periods = sessionLen,
                                        RoomCode = room
                                    });
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

                // Nếu là lý thuyết, merge usedDays vào theoryUsedDays để thực hành tránh các ngày này
                if (courseClass.CourseClassType != CourseClassType.Lab)
                    foreach (var d in usedDays)
                        theoryUsedDays[parentCode].Add(d);

                assignments.Add(new
                {
                    CourseClassCode = courseClass.CourseClassCode,
                    CourseClassType = courseClass.CourseClassType.ToString(),
                    Sessions = sessionList
                });
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
                    // Tạo lớp lý thuyết
                    var theoryClassCode = $"{config.SubjectCode}-LT{i + 1}";
                    var theoryCourseClass = new CourseClass
                    {
                        SubjectCode = config.SubjectCode,
                        CourseClassCode = theoryClassCode,
                        CourseClassName = $"LT {config.SubjectCode} {i + 1}",
                        Index = globalIndex++,
                        SessionLengths = config.TheorySessions.ToList(),
                    };
                    result.Add(theoryCourseClass);

                    // Với mỗi lớp lý thuyết, tạo 2 lớp thực hành gắn với nó
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
                    TotalTheoryCourseClass = 12,
                    TotalPracticeCourseClass = 5,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 45,
                    PracticeTotalPeriod = 18,
                    TheorySessions = [3, 2, 3], // Tuần có 3 buổi: 3-2-3 tiết
                    PracticeSessions = [3, 3], // Tuần có 2 buổi: 3 tiết mỗi buổi
                    WeekStart = 1
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "CSE488",
                    TotalTheoryCourseClass = 5,
                    TotalPracticeCourseClass = 0,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 45,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [2, 3], // Tuần  2 buổi, mỗi buổi 3 tiết
                    PracticeSessions = [],
                    WeekStart = 1
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "MLP121",
                    TotalTheoryCourseClass = 10,
                    TotalPracticeCourseClass = 0,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 3], // Tuần  2 buổi, mỗi buổi 3 tiết
                    PracticeSessions = [],
                    WeekStart = 1
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "MLPE222",
                    TotalTheoryCourseClass = 10,
                    TotalPracticeCourseClass = 0,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [2, 2, 2], // Tuần  3 buổi, mỗi buổi 2 tiết
                    PracticeSessions = [],
                    WeekStart = 1
                },
                new SubjectScheduleConfig
                {
                    SubjectCode = "SCSO232",
                    TotalTheoryCourseClass = 10,
                    TotalPracticeCourseClass = 0,
                    Stage = SubjectTimelineStage.Stage1,
                    TheoryTotalPeriod = 30,
                    PracticeTotalPeriod = 0,
                    TheorySessions = [3, 2], // Tuần  2 buổi, 3 và 2 tiết
                    PracticeSessions = [],
                    WeekStart = 1
                }
            ];
        }
    }
}