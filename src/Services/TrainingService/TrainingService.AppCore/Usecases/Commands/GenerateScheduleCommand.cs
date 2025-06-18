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

    // Tạo map parentCode => HashSet<int> usedDays (ngày đã dùng cho cả lý thuyết & thực hành)
    var parentUsedDays = new Dictionary<string, HashSet<int>>();

    // Xếp phòng cho các lớp chưa có lịch
    var assignments = new List<object>();
    foreach (var courseClass in courseClasses.Where(e => !slotTimelines.Select(t => t.CourseClassCode).Contains(e.CourseClassCode)))
    {
        // Xác định parentCode: nếu là thực hành thì lấy ParentCourseClassCode, nếu là lý thuyết thì lấy chính mình
        string parentCode = string.IsNullOrEmpty(courseClass.ParentCourseClassCode)
            ? courseClass.CourseClassCode
            : courseClass.ParentCourseClassCode;

        if (!parentUsedDays.ContainsKey(parentCode)) parentUsedDays[parentCode] = new HashSet<int>();
        var usedDays = parentUsedDays[parentCode]; // dùng chung cho các lớp cùng parent

        var requiredConditions = courseClass.CourseClassType == CourseClassType.Lab
            ? new List<string> { "Lab" }
            : new List<string> { "Lecture" };
        var sessionLengths = courseClass.SessionLengths ?? new List<int> { 3 }; // mặc định 1 buổi 3 tiết
        var sessionList = new List<object>();

        foreach (var sessionLen in sessionLengths)
        {
            bool assigned = false;
            for (int day = 0; day < totalDays && !assigned; day++)
            {
                if (usedDays.Contains(day)) continue; // Không xếp trùng ngày với bất kỳ buổi nào cùng parent

                for (int startPeriod = 0; startPeriod <= periodsPerDay - sessionLen && !assigned; startPeriod++)
                {
                    foreach (var room in rooms)
                    {
                        if (courseClass.NumberStudentsExpected > room.Capacity) continue;
                        if (room.SupportedConditions == null ||
                            !requiredConditions.All(cond => room.SupportedConditions.Contains(cond)))
                            continue;

                        // Check slot trống
                        bool conflict = false;
                        for (int p = 0; p < sessionLen; p++)
                            if (roomUsage[room.Code][day, startPeriod + p]) conflict = true;
                        if (conflict) continue;

                        // Đánh dấu slot đã sử dụng
                        for (int p = 0; p < sessionLen; p++)
                            roomUsage[room.Code][day, startPeriod + p] = true;

                        // Đánh dấu ngày đã dùng cho tất cả lớp cùng parent
                        usedDays.Add(day);

                        var slotList = new List<string>();
                        for (int p = 0; p < sessionLen; p++)
                            slotList.Add((startPeriod + p).ToString());

                        sessionList.Add(new
                        {
                            DayOfWeek = day + 2, // 2=Thứ 2
                            StartPeriod = startPeriod + 1, // 1-based cho người dùng
                            Periods = sessionLen,
                            RoomCode = room.Code
                        });
                        assigned = true;
                        break;
                    }
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