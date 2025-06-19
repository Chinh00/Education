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
    public record struct GenerateScheduleModel(string SemesterCode, string SubjectCode, List<string> CourseClassCodes);
    internal class Handler(
        IMongoRepository<Subject> subjectRepository,
        IMongoRepository<Room> roomRepository,
        IMongoRepository<SubjectRegister> subjectRegisterRepository,
        IMongoRepository<SubjectScheduleConfig> subjectScheduleConfigRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository
    ) : IRequestHandler<GenerateScheduleCommand, IResult>
    {
        private const int MAX_CLASS_PER_SUBJECT_PER_SLOT = 3;
        private const int MIN_DISTANCE_BETWEEN_LECTURES = 2;

        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
        {
            var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
            var courseClasses = new List<CourseClass>();

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
                // Loai bo trung lap
                courseClasses = courseClasses.Distinct().ToList();
            }
            // Loai bo trung lap theo CourseClassCode
            courseClasses = courseClasses
                .GroupBy(x => x.CourseClassCode)
                .Select(g => g.First())
                .ToList();

            // lay ra lich da co cua cac lop hoc trong courseClasses
            var courseClassCodes = courseClasses.Select(x => x.CourseClassCode).ToList();
            var timelineSpec = new GetSlotTimelineByListCodeSpec(courseClassCodes);
            // day la danh sach lich hoc da co cua cac lop trong courseClasses
            var slotTimelines = await slotTimelineRepository.FindAsync(timelineSpec, cancellationToken);

            // Tạo bản đồ trạng thái từng phòng từng ngày từng tiết: roomCode -> [6,12]
            int totalDays = 6;
            int periodsPerDay = 12;
            var roomUsage = new Dictionary<string, bool[,]>();
            foreach (var room in rooms)
                roomUsage[room.Code] = new bool[totalDays, periodsPerDay];

            // Map courseClassCode => CourseClass (đảm bảo không trùng key)
            var courseClassDict = courseClasses
                .GroupBy(x => x.CourseClassCode)
                .ToDictionary(g => g.Key, g => g.First());

            // Tạo map parentCode => HashSet<int> usedTheoryDays (ngày đã dùng cho lý thuyết, để LAB tránh)
            var parentUsedTheoryDays = new Dictionary<string, HashSet<int>>();

            var assignments = new List<object>();

            // Đếm số lớp đã xếp vào từng ngày cho môn này
            var daySubjectCount = new Dictionary<int, int>();
            for (int d = 0; d < totalDays; d++) daySubjectCount[d] = 0;

            // Đếm số lớp cùng môn đã xếp vào từng khung giờ (day, period)
            var slotSubjectCount = new Dictionary<(int day, int period), int>();
            for (int d = 0; d < totalDays; d++)
                for (int p = 0; p < periodsPerDay; p++)
                    slotSubjectCount[(d, p)] = 0;

            // Lấy lịch đã xếp cho tất cả các phòng trong học kỳ này (để không xếp chồng lên lịch phòng cũ)
            var oldSlotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineBySemesterCodeAndListRoomCodeAndStageSpec(request.Model.SemesterCode,
                    rooms.Select(e => e.Code).ToArray(), (SubjectTimelineStage)courseClasses?.FirstOrDefault()?.Stage), cancellationToken);

            // CHUẨN BỊ MAP ĐỂ TRA CỨU NHANH LỊCH PHÒNG CŨ
            var oldRoomBusy = new Dictionary<string, HashSet<(int day, int period)>>();
            foreach (var room in rooms)
                oldRoomBusy[room.Code] = new HashSet<(int, int)>();
            foreach (var slot in oldSlotTimelines)
            {
                var day = slot.DayOfWeek;
                var roomCode = slot.RoomCode;
                if (!oldRoomBusy.ContainsKey(roomCode)) continue;
                foreach (var slotStr in slot.Slots)
                {
                    if (int.TryParse(slotStr, out var period))
                    {
                        oldRoomBusy[roomCode].Add((day, period));
                    }
                }
            }

            foreach (var courseClass in courseClasses)
            {
                var courseClassSubjectConfig = await subjectScheduleConfigRepository.FindOneAsync(
                    new GetSubjectScheduleConfigSubjectCodeSpec(request.Model.SemesterCode, courseClass.SubjectCode, [(SubjectTimelineStage)courseClass?.Stage]), cancellationToken);
                var sessionPeriod = courseClassSubjectConfig?.SessionPriority; // 0: buổi sáng, 1: buổi chiều, -1: không ưu tiên buổi nào

                // LẤY ĐIỀU KIỆN PHÒNG
                var lectureConditions = courseClassSubjectConfig?.LectureRequiredConditions ?? new List<string>();
                var labConditions = courseClassSubjectConfig?.LabRequiredConditions ?? new List<string>();
                var requiredConditions = courseClass.CourseClassType == CourseClassType.Lab
                    ? labConditions
                    : lectureConditions;

                // Xác định parentCode: nếu là thực hành thì lấy ParentCourseClassCode, nếu là lý thuyết thì lấy chính mình
                string parentCode = string.IsNullOrEmpty(courseClass.ParentCourseClassCode)
                    ? courseClass.CourseClassCode
                    : courseClass.ParentCourseClassCode;

                if (!parentUsedTheoryDays.ContainsKey(parentCode)) parentUsedTheoryDays[parentCode] = new HashSet<int>();
                var usedTheoryDays = parentUsedTheoryDays[parentCode]; // Ngày đã dùng cho lý thuyết (Lecture) cùng parent

                // ==== Khoảng cách tối thiểu giữa các buổi lý thuyết của cùng 1 lớp ====
                // Lưu các ngày đã xếp lý thuyết cho lớp này
                var theoryDaysForThisClass = new List<int>();

                var sessionLengths = courseClass.SessionLengths ?? new List<int> { 3 }; // mặc định 1 buổi 3 tiết
                var sessionList = new List<object>();

                foreach (var sessionLen in sessionLengths)
                {
                    bool assigned = false;
                    int? preferredLabDay = null;

                    // Nếu là lớp thực hành, ưu tiên xếp cùng ngày với các lớp thực hành cùng parent đã xếp
                    if (courseClass.CourseClassType == CourseClassType.Lab)
                    {
                        // Tìm các ngày đã xếp cho các LAB cùng parent (ưu tiên xếp cùng ngày nếu có)
                        var labDays = assignments
                            .Where(a =>
                                a.GetType().GetProperty("CourseClassType")?.GetValue(a)?.ToString() == "Lab" &&
                                a.GetType().GetProperty("CourseClassCode")?.GetValue(a)?.ToString() != courseClass.CourseClassCode &&
                                !string.IsNullOrEmpty(courseClass.ParentCourseClassCode) &&
                                courseClass.ParentCourseClassCode == courseClassDict[((string)a.GetType().GetProperty("CourseClassCode")?.GetValue(a))].ParentCourseClassCode
                            )
                            .SelectMany(a => ((IEnumerable<object>)a.GetType().GetProperty("Sessions")?.GetValue(a) ?? new List<object>())
                                .Select(s => (int)s.GetType().GetProperty("DayOfWeek")?.GetValue(s))) // day: 0-based
                            .ToList();

                        if (labDays.Any())
                            preferredLabDay = labDays.First(); // Ưu tiên xếp cùng ngày LAB đầu tiên đã xếp
                    }

                    // Xác định dải tiết ưu tiên dựa vào sessionPeriod
                    List<int> startPeriods;
                    if (sessionPeriod == 0)
                    {
                        // Ưu tiên buổi sáng (tiết 0-5)
                        startPeriods = Enumerable.Range(0, 6).ToList();
                        startPeriods.AddRange(Enumerable.Range(6, periodsPerDay - 6));
                    }
                    else if (sessionPeriod == 1)
                    {
                        // Ưu tiên buổi chiều (tiết 6-11)
                        startPeriods = Enumerable.Range(6, periodsPerDay - 6).ToList();
                        startPeriods.AddRange(Enumerable.Range(0, 6));
                    }
                    else
                    {
                        // Không ưu tiên, duyệt từ tiết 0-11 như thường lệ
                        startPeriods = Enumerable.Range(0, periodsPerDay).ToList();
                    }

                    // Tính toán dàn trải: duyệt ngày theo số lớp đã xếp từ ít đến nhiều
                    var tryDays = Enumerable.Range(0, totalDays).ToList();
                    if (courseClass.CourseClassType != CourseClassType.Lab || !preferredLabDay.HasValue)
                    {
                        tryDays = daySubjectCount.OrderBy(x => x.Value).Select(x => x.Key).ToList();
                    }
                    else
                    {
                        // Nếu là Lab và có preferredLabDay, chỉ thử ngày này trước
                        tryDays = new List<int> { preferredLabDay.Value };
                        // Nếu không được sẽ thử tiếp các ngày còn lại (dàn trải)
                        tryDays.AddRange(daySubjectCount.Where(x => x.Key != preferredLabDay.Value).OrderBy(x => x.Value).Select(x => x.Key));
                    }

                    foreach (var day in tryDays)
                    {
                        if (assigned) break;

                        // LECTURE hoặc LAB đều không được xếp trùng ngày với lý thuyết cùng parent
                        if (usedTheoryDays.Contains(day)) continue;

                        // ==== Kiểm tra khoảng cách tối thiểu giữa các buổi lý thuyết của cùng 1 lớp ====
                        if (courseClass.CourseClassType == CourseClassType.Lecture)
                        {
                            bool tooClose = theoryDaysForThisClass.Any(prevDay => Math.Abs(day - prevDay) < MIN_DISTANCE_BETWEEN_LECTURES);
                            if (tooClose) continue;
                        }

                        foreach (int startPeriod in startPeriods)
                        {
                            if (startPeriod > periodsPerDay - sessionLen) continue;

                            // Kiểm tra không cắt ngang giờ nghỉ trưa (không chứa cả tiết 5 và 6)
                            int periodFirst = startPeriod;
                            int periodLast = startPeriod + sessionLen - 1;
                            if (periodFirst <= 5 && periodLast >= 6)
                                continue;

                            // ==== KIỂM SOÁT SỐ LỚP DẠY CÙNG KHUNG GIỜ ====
                            bool tooManyInSlot = false;
                            for (int p = 0; p < sessionLen; p++)
                            {
                                if (day >= 0 && startPeriod + p >= 0)
                                {
                                    if (slotSubjectCount.TryGetValue((day, startPeriod + p), out int currentCount))
                                    {
                                        if (currentCount >= MAX_CLASS_PER_SUBJECT_PER_SLOT)
                                        {
                                            tooManyInSlot = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (tooManyInSlot) continue;

                            foreach (var room in rooms.OrderBy(_ => Guid.NewGuid()).ToList())
                            {
                                if (courseClass.NumberStudentsExpected > room.Capacity) continue;
                                if (room.SupportedConditions == null ||
                                    !requiredConditions.All(cond => room.SupportedConditions.Contains(cond)))
                                    continue;

                                // ==== BỔ SUNG: CHECK PHÒNG ĐÃ CÓ LỊCH CŨ KHÔNG ====
                                bool conflictWithOld = false;
                                for (int p = 0; p < sessionLen; p++)
                                {
                                    if (day >= 0 && startPeriod + p >= 0
                                        && oldRoomBusy.TryGetValue(room.Code, out var busySet)
                                        && busySet.Contains((day, startPeriod + p)))
                                    {
                                        conflictWithOld = true;
                                        break;
                                    }
                                }
                                if (conflictWithOld) continue;
                                // ==== END CHECK PHÒNG ĐÃ CÓ LỊCH CŨ ====

                                // ==== CHECK CONFLICT LAB-LAB ====
                                if (courseClass.CourseClassType == CourseClassType.Lab)
                                {
                                    bool conflictWithOtherLab = assignments.Any(a =>
                                        a.GetType().GetProperty("CourseClassType")?.GetValue(a)?.ToString() == "Lab"
                                        && a.GetType().GetProperty("CourseClassCode")?.GetValue(a)?.ToString() != courseClass.CourseClassCode
                                        && !string.IsNullOrEmpty(courseClass.ParentCourseClassCode)
                                        && courseClass.ParentCourseClassCode == courseClassDict[((string)a.GetType().GetProperty("CourseClassCode")?.GetValue(a))].ParentCourseClassCode
                                        && ((IEnumerable<object>)a.GetType().GetProperty("Sessions")?.GetValue(a) ?? new List<object>())
                                            .Any(s =>
                                            {
                                                int otherDay = (int)s.GetType().GetProperty("DayOfWeek")?.GetValue(s); // day 0-based
                                                int otherStart = (int)s.GetType().GetProperty("StartPeriod")?.GetValue(s); // startPeriod 0-based
                                                int otherPeriods = (int)s.GetType().GetProperty("Periods")?.GetValue(s);
                                                if (otherDay != day) return false;
                                                int otherEnd = otherStart + otherPeriods - 1;
                                                int thisEnd = startPeriod + sessionLen - 1;
                                                return !(startPeriod > otherEnd || thisEnd < otherStart);
                                            })
                                    );
                                    if (conflictWithOtherLab)
                                        continue;
                                }
                                // ==== END CHECK ====

                                // Check slot trống (tạm trong phiên xếp lịch này)
                                bool conflict = false;
                                for (int p = 0; p < sessionLen; p++)
                                    if (day >= 0 && startPeriod + p >= 0 && roomUsage[room.Code][day, startPeriod + p]) conflict = true;
                                if (conflict) continue;

                                // Đánh dấu slot đã sử dụng
                                if (day >= 0 && startPeriod >= 0)
                                {
                                    for (int p = 0; p < sessionLen; p++)
                                        roomUsage[room.Code][day, startPeriod + p] = true;
                                }

                                // Đánh dấu ngày đã dùng cho lý thuyết (Lecture)
                                if (courseClass.CourseClassType == CourseClassType.Lecture)
                                {
                                    usedTheoryDays.Add(day);
                                    theoryDaysForThisClass.Add(day);
                                }

                                var slotList = new List<string>();
                                for (int p = 0; p < sessionLen; p++)
                                    slotList.Add((startPeriod + p).ToString());

                                sessionList.Add(new
                                {
                                    DayOfWeek = day, // 0-based
                                    StartPeriod = startPeriod, // 0-based
                                    Periods = sessionLen,
                                    RoomCode = room.Code
                                });

                                await slotTimelineRepository.AddAsync(new SlotTimeline()
                                {
                                    CourseClassCode = courseClass.CourseClassCode,
                                    DayOfWeek = day,
                                    RoomCode = room.Code,
                                    Slots = slotList,
                                    StartWeek = courseClass.WeekStart,
                                    EndWeek = courseClass.WeekEnd
                                }, cancellationToken);

                                // Cập nhật số lớp đã xếp vào ngày này
                                if (day >= 0)
                                    daySubjectCount[day]++;

                                // Cập nhật số lớp cùng môn đã xếp vào từng khung giờ
                                if (day >= 0 && startPeriod >= 0)
                                {
                                    for (int p = 0; p < sessionLen; p++)
                                    {
                                        var key = (day, startPeriod + p);
                                        if (slotSubjectCount.ContainsKey(key))
                                            slotSubjectCount[key]++;
                                    }
                                }

                                assigned = true;
                                break;
                            }
                            if (assigned) break;
                        }
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
                assignments.Add(new
                {
                    CourseClassCode = courseClass.CourseClassCode,
                    CourseClassType = courseClass.CourseClassType.ToString(),
                    Sessions = sessionList
                });
            }
            return Results.Ok(assignments);
        }
    }
}