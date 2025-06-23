using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record GenerateTeacherForCourseClassCommand(GenerateTeacherForCourseClassCommand.GenerateTeacherForCourseClassModel Model) : ICommand<IResult>
{
    public record struct GenerateTeacherForCourseClassModel(string SemesterCode, int Stage, string SubjectCode, List<string> CourseClassCodes);
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<SlotTimeline> slotTimelineRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<Staff> staffRepository,
        IMongoRepository<Subject> subjectRepository)
        : IRequestHandler<GenerateTeacherForCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(GenerateTeacherForCourseClassCommand request, CancellationToken cancellationToken)
{
    var departmentCode = claimContextAccessor.GetUsername();
    if (departmentCode == "admin")
    {
        var subject = await subjectRepository.FindOneAsync(
            new GetSubjectByCodeSpec(request.Model.SubjectCode),
            cancellationToken: cancellationToken);
        departmentCode = subject.DepartmentCode;
    }
    // Lấy danh sách tất cả lớp của môn này, stage này (để tìm lớp con)
    var allCourseClasses = await courseClassRepository.FindAsync(
        new GetCourseClassBySemesterCodeAndListStageAnsSubjectCodeSpec(
            request.Model.SemesterCode,
            request.Model.SubjectCode,
            [request.Model.Stage]),
        cancellationToken: cancellationToken);

    // Lấy slot timeline của tất cả lớp này
    var allSlotTimelines = await slotTimelineRepository.FindAsync(
        new GetSlotTimelineByCourseClassCodesSpec(allCourseClasses.Select(c => c.CourseClassCode).ToList()),
        cancellationToken: cancellationToken);

    // Lấy giáo viên bộ môn
    var staffs = await staffRepository.FindAsync(
        new GetStaffByDepartmentCodeSpec(departmentCode),
        cancellationToken: cancellationToken);

    // Tạo map lịch dạy: StaffCode -> HashSet<(DayOfWeek, Slot)>
    var staffSchedules = new Dictionary<string, HashSet<(int day, string slot)>>();
    foreach (var staff in staffs)
        staffSchedules[staff.Code] = new HashSet<(int, string)>();

    // Cập nhật lịch dạy của giáo viên đã phân công trước đó
    foreach (var courseClass in allCourseClasses)
    {
        if (string.IsNullOrWhiteSpace(courseClass.TeacherCode)) continue;
        var timelines = allSlotTimelines.Where(t => t.CourseClassCode == courseClass.CourseClassCode).ToList();
        foreach (var timeline in timelines)
        {
            foreach (var slot in timeline.Slots)
                staffSchedules[courseClass.TeacherCode].Add((timeline.DayOfWeek, slot));
        }
    }

    // Duyệt từng lớp gốc cần xếp (theo request.Model.CourseClassCodes)
    foreach (var mainClassCode in request.Model.CourseClassCodes)
    {
        // Tìm lớp cha
        var parentClass = allCourseClasses.FirstOrDefault(c => c.CourseClassCode == mainClassCode);
        if (parentClass == null) continue;

        // Tìm tất cả lớp con trực tiếp của lớp cha này
        var childClasses = allCourseClasses
            .Where(c => c.ParentCourseClassCode == mainClassCode)
            .ToList();

        // Gom lại thành một nhóm: gồm lớp cha và các lớp con
        var relatedClasses = new List<CourseClass> { parentClass };
        relatedClasses.AddRange(childClasses);

        // Nếu tất cả các lớp này đã có giáo viên thì bỏ qua
        if (relatedClasses.All(c => !string.IsNullOrWhiteSpace(c.TeacherCode)))
            continue;

        // Tìm tất cả SlotTimeline của các lớp này
        var timelinesOfRelatedClasses = allSlotTimelines
            .Where(t => relatedClasses.Any(c => c.CourseClassCode == t.CourseClassCode))
            .ToList();

        // Shuffle danh sách giáo viên
        var shuffledStaffs = staffs.OrderBy(_ => Guid.NewGuid()).ToList();

        // Tìm giáo viên không bị trùng lịch với bất kỳ slot nào của cả nhóm lớp này
        Staff selectedStaff = null;
        foreach (var staff in shuffledStaffs)
        {
            bool conflict = false;
            foreach (var t in timelinesOfRelatedClasses)
            {
                foreach (var slot in t.Slots)
                {
                    if (staffSchedules[staff.Code].Contains((t.DayOfWeek, slot)))
                    {
                        conflict = true;
                        break;
                    }
                }
                if (conflict) break;
            }
            if (!conflict)
            {
                selectedStaff = staff;
                break;
            }
        }

        if (selectedStaff != null)
        {
            // Gán giáo viên cho toàn bộ nhóm lớp (lớp cha + các lớp con)
            foreach (var cc in relatedClasses)
            {
                cc.TeacherCode = selectedStaff.Code;
                cc.TeacherName = selectedStaff.FullName;
                await courseClassRepository.UpsertOneAsync(new GetCourseClassByCodeSpec(cc.CourseClassCode), cc, cancellationToken: cancellationToken);
            }
            // Cập nhật lịch dạy của giáo viên này
            foreach (var t in timelinesOfRelatedClasses)
            {
                foreach (var slot in t.Slots)
                    staffSchedules[selectedStaff.Code].Add((t.DayOfWeek, slot));
            }
        }
        else
        {
            // Không xếp được giáo viên, lưu lại trạng thái cho toàn bộ nhóm lớp
            foreach (var cc in relatedClasses)
            {
                cc.TeacherCode = null;
                cc.TeacherName = "không xếp được giáo viên";
                await courseClassRepository.UpsertOneAsync(new GetCourseClassByCodeSpec(cc.CourseClassCode), cc, cancellationToken: cancellationToken);
            }
        }
    }

    return Results.Ok();
}
    }
    
}