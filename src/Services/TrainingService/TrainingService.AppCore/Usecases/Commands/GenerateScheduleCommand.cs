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
        public async Task<IResult> Handle(GenerateScheduleCommand request, CancellationToken cancellationToken)
            {
                var rooms = await roomRepository.FindAsync(new TrueSpecificationBase<Room>(), cancellationToken);
                var courseClasses = new List<CourseClass>();

                var courseClassOfTree = await courseClassRepository.FindOneAsync(
                    new GetCourseClassByListCodeAndSemesterCodeSpec(request.Model.CourseClassCodes, request.Model.SemesterCode), cancellationToken);

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

                // ==== Xếp các lớp chưa có lịch ====
                foreach (var courseClass in courseClasses.Where(e => !slotTimelines.Select(t => t.CourseClassCode).Contains(e.CourseClassCode)))
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

                        // Vòng lặp ngày (ngày 0-5)
                        for (int day = 0; day < totalDays && !assigned; day++)
                        {
                            // Nếu là Lab và có preferred day thì chỉ thử ngày đó trước
                            if (preferredLabDay.HasValue && day != preferredLabDay.Value) 
                            {
                                if (day < totalDays - 1) continue; // thử tiếp những ngày khác nếu ngày ưu tiên không xếp được
                            }

                            // LECTURE hoặc LAB đều không được xếp trùng ngày với lý thuyết cùng parent
                            if (usedTheoryDays.Contains(day)) continue;

                            foreach (int startPeriod in startPeriods)
                            {
                                if (startPeriod > periodsPerDay - sessionLen) continue;

                                // Kiểm tra không cắt ngang giờ nghỉ trưa (không chứa cả tiết 5 và 6)
                                int periodFirst = startPeriod;
                                int periodLast = startPeriod + sessionLen - 1;
                                if (periodFirst <= 5 && periodLast >= 6)
                                    continue;

                                foreach (var room in rooms)
                                {
                                    if (courseClass.NumberStudentsExpected > room.Capacity) continue;
                                    if (room.SupportedConditions == null ||
                                        !requiredConditions.All(cond => room.SupportedConditions.Contains(cond)))
                                        continue;

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

                                    // Check slot trống
                                    bool conflict = false;
                                    for (int p = 0; p < sessionLen; p++)
                                        if (roomUsage[room.Code][day, startPeriod + p]) conflict = true;
                                    if (conflict) continue;

                                    // Đánh dấu slot đã sử dụng
                                    for (int p = 0; p < sessionLen; p++)
                                        roomUsage[room.Code][day, startPeriod + p] = true;

                                    // Đánh dấu ngày đã dùng cho lý thuyết (Lecture)
                                    if (courseClass.CourseClassType == CourseClassType.Lecture)
                                        usedTheoryDays.Add(day);

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