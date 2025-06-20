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
    public record struct GenerateScheduleModel(string SemesterCode, int Stage, string SubjectCode, List<string> CourseClassCodes);
    internal class Handler(
        IMongoRepository<Subject> subjectRepository,
        IMongoRepository<Room> roomRepository,
        IMongoRepository<SubjectRegister> subjectRegisterRepository,
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository
    ) : IRequestHandler<GenerateScheduleCommand, IResult>
    {
        private const int MIN_DAY_PER_SESSION_WEEK = 2;
        private static readonly Random _random = new();
        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
        {
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            var courseClasses = new List<CourseClass>();
            var subjectScheduleConfigs = await subjectScheduleConfigRepository.FindAsync(
                new GetSubjectScheduleConfigSubjectCodeSpec(request.Model.SemesterCode, request.Model.SubjectCode, 
                    request.Model.Stage == 1 || request.Model.Stage == 2
                        ? [(SubjectTimelineStage)request.Model.Stage]
                        : [SubjectTimelineStage.Stage1Of2, SubjectTimelineStage.Stage2Of2]),
                cancellationToken);

            foreach (var modelCourseClassCode in request.Model.CourseClassCodes)
            {
                var courseClassSpec = new GetCourseClassByCodeSpec(modelCourseClassCode);
                var courseClass = await courseClassRepository.FindOneAsync(courseClassSpec, cancellationToken);

                courseClasses.AddRange(courseClass);

                // neu course class nay la lop chinh
                if (string.IsNullOrEmpty(courseClass.ParentCourseClassCode))
                {
                    // lay ra cac lop con cua lop chinh va them vao danh sach
                    var spec = new GetCourseClassByParentCodeSpec(courseClass.CourseClassCode);
                    var courseClassChildren = await courseClassRepository.FindAsync(spec, cancellationToken);
                    courseClasses.AddRange(courseClassChildren);
                }
                else
                {
                    // neu course class nay la lop con thi them vao danh sach, tim lop cha va cac lop con con lai
                    var parentSpec = new GetCourseClassByParentCodeSpec(courseClass.ParentCourseClassCode);
                    var parentCourseClass = await courseClassRepository.FindOneAsync(parentSpec, cancellationToken);
                    courseClasses.Add(parentCourseClass);
                    var childSpec = new GetCourseClassByParentCodeSpec(parentCourseClass.CourseClassCode);
                    var childCourseClasses = await courseClassRepository.FindAsync(childSpec, cancellationToken);
                    courseClasses.AddRange(childCourseClasses);
                }
            }
            courseClasses = courseClasses.DistinctBy(e => e.CourseClassCode).ToList();
            
            
            // Tạo bản đồ trạng thái từng phòng từng ngày từng tiết: roomCode -> [6,12]
            var totalDays = 6;
            var periodsPerDay = 12;
            var roomUsage = new Dictionary<string, bool[,]>();
            foreach (var room in rooms)
                roomUsage[room.Code] = new bool[totalDays, periodsPerDay];
            
            
            // Lấy danh sách các tiết học đã xếp cho phòng học 
            var slotTimelinesOfRoom = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineFreeByRoomSpec(request.Model.SemesterCode, (SubjectTimelineStage)request.Model.Stage),
                cancellationToken);
            // Đánh giấu các phòng đã có lịch
            foreach (var slot in slotTimelinesOfRoom)
            {
                var usage = roomUsage[slot.RoomCode];
                foreach (var slotStr in slot.Slots)
                {
                    var slotIdx = int.Parse(slotStr);
                    usage[slot.DayOfWeek, slotIdx] = true;
                }
            }
            
            // Lấy danh sách các tiết học đã xếp cho môn học
            var slotTimelinesByCourseClassCodes = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByCourseClassCodesSpec(request.Model.CourseClassCodes),
                cancellationToken);
            // Đánh giấu các lớp đã có lịch
            var classUsage = new Dictionary<string, bool[,]>();
            foreach (var cc in courseClasses)
                classUsage[cc.CourseClassCode] = new bool[totalDays, periodsPerDay];

            foreach (var slot in slotTimelinesByCourseClassCodes)
            {
                var usage = classUsage[slot.CourseClassCode];
                foreach (var slotStr in slot.Slots)
                {
                    var slotIdx = int.Parse(slotStr);
                    usage[slot.DayOfWeek, slotIdx] = true;
                }
            }
            
            
            var slotTimelinesResult = new List<SlotTimeline>();
            
            var classDaysUsed = new Dictionary<string, bool[]>();
            foreach (var cc in courseClasses)
                classDaysUsed[cc.CourseClassCode] = new bool[totalDays];
            
            var slotClassCount = new int[totalDays, periodsPerDay];

            foreach (var slot in slotTimelinesByCourseClassCodes)
            {
                foreach (var slotStr in slot.Slots)
                {
                    int slotIdx = int.Parse(slotStr);
                    slotClassCount[slot.DayOfWeek, slotIdx]++;
                }
            }
            var slotDayClassCount = new int[totalDays];
            
            foreach (var slot in slotTimelinesByCourseClassCodes)
            {
                // Đếm mỗi slot chỉ 1 lần cho mỗi lớp mỗi ngày
                slotDayClassCount[slot.DayOfWeek]++;
            }

            var childClassRoomByDay = new Dictionary<string, Dictionary<int, string>>();
            // Xếp lịch cho những môn chưa có lịch trong slotTimelinesByCourseClassCodes và có trong yêu cầu request
            foreach (var courseClass in courseClasses?.Where(e =>
                 request.Model.CourseClassCodes.Contains(e.CourseClassCode)))
            {
                var config = subjectScheduleConfigs.FirstOrDefault(x => x.Stage == courseClass.Stage);
                var sessionsPriority = config?.SessionPriority ?? -1; // 0 - sáng, 1 - chiều, -1 không ưu tiên
                var sessionLengths = courseClass.SessionLengths;
                var scheduledDays = new List<int>(); // ngày đã xếp của lớp này

                // Shuffle sessionIndexes to randomize session order (xáo trộn thứ tự buổi)
                var sessionIndexes = Enumerable.Range(0, sessionLengths.Count).OrderBy(_ => _random.Next()).ToList();

                for (var idx = 0; idx < sessionIndexes.Count; idx++)
                {
                    var sessionIdx = sessionIndexes[idx];
                    var sessionLength = sessionLengths[sessionIdx];
                    bool scheduled = false;

                    bool isChildClass = !string.IsNullOrEmpty(courseClass.ParentCourseClassCode);
                    HashSet<int> parentDays = new();
                    if (isChildClass)
                    {
                        var parentClass = courseClasses.FirstOrDefault(c => c.CourseClassCode == courseClass.ParentCourseClassCode);
                        if (parentClass != null)
                        {
                            var parentUsage = classUsage[parentClass.CourseClassCode];
                            for (int day = 0; day < totalDays; day++)
                            for (int period = 0; period < periodsPerDay; period++)
                            {
                                if (parentUsage[day, period])
                                {
                                    parentDays.Add(day);
                                    break;
                                }
                            }
                        }
                    }

                    // ƯU TIÊN XẾP LIỀN KỀ, KHÔNG ĐÈ LÊN NHAU (giữ nguyên, bổ sung dàn đều ngày)
                    if (isChildClass)
                    {
                        var siblingClasses = courseClasses
                            .Where(c => c.ParentCourseClassCode == courseClass.ParentCourseClassCode
                                        && c.CourseClassCode != courseClass.CourseClassCode)
                            .ToList();

                        var orderedDays = Enumerable.Range(0, totalDays)
                            .OrderBy(d => slotDayClassCount[d])
                            .ToList();

                        foreach (int day in orderedDays)
                        {
                            if (parentDays.Contains(day)) continue;
                            if (classDaysUsed[courseClass.CourseClassCode][day]) continue;
                            if (scheduledDays.Any(d0 => Math.Abs(d0 - day) < MIN_DAY_PER_SESSION_WEEK)) continue;

                            foreach (var sibling in siblingClasses)
                            {
                                var siblingUsage = classUsage[sibling.CourseClassCode];
                                var siblingRanges = new List<(int start, int length)>();
                                int prev = -2, rangeStart = -1, count = 0;
                                for (int period = 0; period < periodsPerDay; period++)
                                {
                                    if (siblingUsage[day, period])
                                    {
                                        if (rangeStart == -1) { rangeStart = period; count = 1; }
                                        else if (period == prev + 1) count++;
                                        else { siblingRanges.Add((rangeStart, count)); rangeStart = period; count = 1; }
                                        prev = period;
                                    }
                                }
                                if (rangeStart != -1) siblingRanges.Add((rangeStart, count));

                                foreach (var (sibStart, sibLen) in siblingRanges)
                                {
                                    // Thử xếp liền sau
                                    int startPeriod = sibStart + sibLen;
                                    if (IsValidSessionSlotWithPriority(startPeriod, sessionLength, sessionsPriority))
                                    {
                                        // Lấy room ưu tiên nếu có lớp con cùng lớp cha đã xếp trong ngày này
                                        List<Room> shuffledRooms;
                                        string parentCode = courseClass.ParentCourseClassCode;
                                        string preferRoom = null;
                                        if (!string.IsNullOrEmpty(parentCode) && childClassRoomByDay.ContainsKey(parentCode)
                                            && childClassRoomByDay[parentCode].ContainsKey(day))
                                        {
                                            preferRoom = childClassRoomByDay[parentCode][day];
                                            // Đưa phòng ưu tiên lên đầu danh sách phòng
                                            shuffledRooms = rooms.OrderBy(x => x.Code == preferRoom ? 0 : 1).ThenBy(x => _random.Next()).ToList();
                                        }
                                        else
                                        {
                                            shuffledRooms = rooms.OrderBy(x => _random.Next()).ToList();
                                        }
                                        Room bestRoom = null;
                                        int minConflict = int.MaxValue;
                                        foreach (var room in shuffledRooms)
                                        {
                                            bool canSchedule = true;
                                            int conflict = 0;
                                            for (int i = 0; i < sessionLength; i++)
                                            {
                                                if (classUsage[courseClass.CourseClassCode][day, startPeriod + i]
                                                    || roomUsage[room.Code][day, startPeriod + i]
                                                    || siblingUsage[day, startPeriod + i])
                                                {
                                                    canSchedule = false;
                                                    break;
                                                }
                                                conflict += slotClassCount[day, startPeriod + i];
                                            }
                                            if (canSchedule && conflict < minConflict)
                                            {
                                                minConflict = conflict;
                                                bestRoom = room;
                                            }
                                        }
                                        if (bestRoom != null)
                                        {
                                            for (int i = 0; i < sessionLength; i++)
                                            {
                                                classUsage[courseClass.CourseClassCode][day, startPeriod + i] = true;
                                                roomUsage[bestRoom.Code][day, startPeriod + i] = true;
                                                slotClassCount[day, startPeriod + i]++;
                                            }
                                            slotDayClassCount[day]++;
                                            classDaysUsed[courseClass.CourseClassCode][day] = true;
                                            scheduledDays.Add(day);

                                            // Lưu lại phòng này cho các lớp con tiếp theo ưu tiên
                                            if (!string.IsNullOrEmpty(parentCode))
                                            {
                                                if (!childClassRoomByDay.ContainsKey(parentCode))
                                                    childClassRoomByDay[parentCode] = new Dictionary<int, string>();
                                                childClassRoomByDay[parentCode][day] = bestRoom.Code;
                                            }

                                            var timeline = new SlotTimeline
                                            {
                                                CourseClassCode = courseClass.CourseClassCode,
                                                RoomCode = bestRoom.Code,
                                                DayOfWeek = day,
                                                StartWeek = courseClass.WeekStart,
                                                EndWeek = courseClass.WeekEnd,
                                                Slots = Enumerable.Range(startPeriod, sessionLength).Select(x => x.ToString()).ToList()
                                            };
                                            slotTimelinesResult.Add(timeline);
                                            scheduled = true;
                                            break;
                                        }
                                    }
                                    if (scheduled) break;

                                    // Thử xếp liền trước
                                    startPeriod = sibStart - sessionLength;
                                    if (startPeriod >= 0 && IsValidSessionSlotWithPriority(startPeriod, sessionLength, sessionsPriority))
                                    {
                                        List<Room> shuffledRooms;
                                        string parentCode = courseClass.ParentCourseClassCode;
                                        string preferRoom = null;
                                        if (!string.IsNullOrEmpty(parentCode) && childClassRoomByDay.ContainsKey(parentCode)
                                            && childClassRoomByDay[parentCode].ContainsKey(day))
                                        {
                                            preferRoom = childClassRoomByDay[parentCode][day];
                                            shuffledRooms = rooms.OrderBy(x => x.Code == preferRoom ? 0 : 1).ThenBy(x => _random.Next()).ToList();
                                        }
                                        else
                                        {
                                            shuffledRooms = rooms.OrderBy(x => _random.Next()).ToList();
                                        }
                                        Room bestRoom = null;
                                        int minConflict = int.MaxValue;
                                        foreach (var room in shuffledRooms)
                                        {
                                            bool canSchedule = true;
                                            int conflict = 0;
                                            for (int i = 0; i < sessionLength; i++)
                                            {
                                                if (classUsage[courseClass.CourseClassCode][day, startPeriod + i]
                                                    || roomUsage[room.Code][day, startPeriod + i]
                                                    || siblingUsage[day, startPeriod + i])
                                                {
                                                    canSchedule = false;
                                                    break;
                                                }
                                                conflict += slotClassCount[day, startPeriod + i];
                                            }
                                            if (canSchedule && conflict < minConflict)
                                            {
                                                minConflict = conflict;
                                                bestRoom = room;
                                            }
                                        }
                                        if (bestRoom != null)
                                        {
                                            for (int i = 0; i < sessionLength; i++)
                                            {
                                                classUsage[courseClass.CourseClassCode][day, startPeriod + i] = true;
                                                roomUsage[bestRoom.Code][day, startPeriod + i] = true;
                                                slotClassCount[day, startPeriod + i]++;
                                            }
                                            slotDayClassCount[day]++;
                                            classDaysUsed[courseClass.CourseClassCode][day] = true;
                                            scheduledDays.Add(day);

                                            if (!string.IsNullOrEmpty(parentCode))
                                            {
                                                if (!childClassRoomByDay.ContainsKey(parentCode))
                                                    childClassRoomByDay[parentCode] = new Dictionary<int, string>();
                                                childClassRoomByDay[parentCode][day] = bestRoom.Code;
                                            }

                                            var timeline = new SlotTimeline
                                            {
                                                CourseClassCode = courseClass.CourseClassCode,
                                                RoomCode = bestRoom.Code,
                                                DayOfWeek = day,
                                                StartWeek = 1,
                                                EndWeek = 1,
                                                Slots = Enumerable.Range(startPeriod + 1, sessionLength).Select(x => x.ToString()).ToList()
                                            };
                                            slotTimelinesResult.Add(timeline);
                                            scheduled = true;
                                            break;
                                        }
                                    }
                                    if (scheduled) break;
                                }
                                if (scheduled) break;
                            }
                            if (scheduled) break;
                        }
                        if (scheduled) continue;
                    }

                    // Xếp lịch bình thường (ưu tiên ngày có ít lớp nhất, sau đó slot ít lớp nhất trong ngày)
                    int bestDay = -1, bestPeriod = -1;
                    int minConflictSlot = int.MaxValue;
                    Room bestRoomNormal = null;

                    var orderedDaysNorm = Enumerable.Range(0, totalDays)
                        .OrderBy(d => slotDayClassCount[d])
                        .ToList();

                    foreach (int day in orderedDaysNorm)
                    {
                        if (classDaysUsed[courseClass.CourseClassCode][day]) continue;
                        if (isChildClass && parentDays.Contains(day)) continue;
                        if (scheduledDays.Any(d0 => Math.Abs(d0 - day) < MIN_DAY_PER_SESSION_WEEK)) continue;

                        // Ưu tiên phòng đã xếp cho lớp con khác cùng lớp cha trong ngày này
                        List<Room> shuffledRooms;
                        string parentCode = courseClass.ParentCourseClassCode;
                        string preferRoom = null;
                        if (isChildClass && !string.IsNullOrEmpty(parentCode) && childClassRoomByDay.ContainsKey(parentCode)
                            && childClassRoomByDay[parentCode].ContainsKey(day))
                        {
                            preferRoom = childClassRoomByDay[parentCode][day];
                            shuffledRooms = rooms.OrderBy(x => x.Code == preferRoom ? 0 : 1).ThenBy(x => _random.Next()).ToList();
                        }
                        else
                        {
                            shuffledRooms = rooms.OrderBy(x => _random.Next()).ToList();
                        }

                        for (int period = 0; period <= periodsPerDay - sessionLength; period++)
                        {
                            if (!IsValidSessionSlotWithPriority(period, sessionLength, sessionsPriority)) continue;

                            foreach (var room in shuffledRooms)
                            {
                                bool roomFree = true;
                                bool classFree = true;
                                int conflict = 0;
                                for (int i = 0; i < sessionLength; i++)
                                {
                                    if (roomUsage[room.Code][day, period + i])
                                        roomFree = false;
                                    if (classUsage[courseClass.CourseClassCode][day, period + i])
                                        classFree = false;
                                    conflict += slotClassCount[day, period + i];
                                }
                                if (roomFree && classFree && conflict < minConflictSlot)
                                {
                                    minConflictSlot = conflict;
                                    bestDay = day;
                                    bestPeriod = period;
                                    bestRoomNormal = room;
                                }
                            }
                        }
                    }

                    if (bestRoomNormal != null)
                    {
                        for (int i = 0; i < sessionLength; i++)
                        {
                            roomUsage[bestRoomNormal.Code][bestDay, bestPeriod + i] = true;
                            classUsage[courseClass.CourseClassCode][bestDay, bestPeriod + i] = true;
                            slotClassCount[bestDay, bestPeriod + i]++;
                        }
                        slotDayClassCount[bestDay]++;
                        classDaysUsed[courseClass.CourseClassCode][bestDay] = true;
                        scheduledDays.Add(bestDay);

                        // Lưu lại phòng này cho các lớp con khác cùng lớp cha ưu tiên
                        string parentCode = courseClass.ParentCourseClassCode;
                        if (isChildClass && !string.IsNullOrEmpty(parentCode))
                        {
                            if (!childClassRoomByDay.ContainsKey(parentCode))
                                childClassRoomByDay[parentCode] = new Dictionary<int, string>();
                            childClassRoomByDay[parentCode][bestDay] = bestRoomNormal.Code;
                        }

                        var timeline = new SlotTimeline
                        {
                            CourseClassCode = courseClass.CourseClassCode,
                            RoomCode = bestRoomNormal.Code,
                            DayOfWeek = bestDay,
                            StartWeek = courseClass.WeekStart,
                            EndWeek = courseClass.WeekEnd,
                            Slots = Enumerable.Range(bestPeriod, sessionLength).Select(x => x.ToString()).ToList()
                        };
                        slotTimelinesResult.Add(timeline);
                        scheduled = true;
                    }

                    if (!scheduled)
                    {
                        Console.WriteLine($"Không thể xếp lịch cho {courseClass.CourseClassCode} - Buổi {sessionIdx + 1}");
                        var timeline = new SlotTimeline
                        {
                            CourseClassCode = courseClass.CourseClassCode,
                            RoomCode = null,
                            DayOfWeek = -1,
                            StartWeek = courseClass.WeekStart,
                            EndWeek = courseClass.WeekEnd,
                            Slots = []
                        };
                        slotTimelinesResult.Add(timeline);
                    }
                }
            }

            foreach (var slotTimeline in slotTimelinesResult)
            {
                await slotTimelineRepository.AddAsync(slotTimeline, cancellationToken);
            }
            
            

           
            return Results.Ok(slotTimelinesResult);
        }
        bool IsValidSessionSlotWithPriority(int start, int length, int sessionPriority)
        {
            // sessionPriority: 0 = sáng, 1 = chiều, -1 = không ưu tiên
            // Sáng: 0-5, Chiều: 6-11
            if (sessionPriority == 0) // chỉ sáng
            {
                if (start >= 0 && start + length - 1 <= 5) return true;
                return false;
            }
            if (sessionPriority == 1) // chỉ chiều
            {
                if (start >= 6 && start + length - 1 <= 11) return true;
                return false;
            }
            // Không ưu tiên
            if (start >= 0 && start + length - 1 <= 5) return true;
            if (start >= 6 && start + length - 1 <= 11) return true;
            return false;
        }
    }
}