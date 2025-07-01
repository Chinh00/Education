using Education.Core.Domain;
using Education.Core.Repository;
using Education.Infrastructure.Authentication;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

// tim giao vien con trong cho lop nay
public record GetTeacherFreeTimelineQuery(string SemesterCode, int Stage, string SubjectCode, string CourseClassCode)
    : IQuery<ListResultModel<Staff>>
{
    internal class Handler(
        IMongoRepository<Staff> staffRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository,
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<Subject> subjectRepository,
        IMongoRepository<CourseClass> courseClassRepository, 
        IMongoRepository<Department> departmentRepository)
        : IRequestHandler<GetTeacherFreeTimelineQuery, ResultModel<ListResultModel<Staff>>>
    {
        public async Task<ResultModel<ListResultModel<Staff>>> Handle(GetTeacherFreeTimelineQuery request, CancellationToken cancellationToken)
        {
            var subject = await subjectRepository.FindOneAsync(
                new GetSubjectByCodeSpec(request.SubjectCode),
                cancellationToken: cancellationToken);
            var departmentCode = subject.DepartmentCode;
            
            var department = await departmentRepository.FindOneAsync(
                new GetDepartmentByCodeSpec(departmentCode),
                cancellationToken: cancellationToken);
            var specCode = department?.Path?.Split("/")[1];
            // danh sach cac bo mon cung khoa
            var departmentOfSpecificalStaff =
                await departmentRepository.FindAsync(new GetDepartmentByPathCodeSpec(specCode), cancellationToken);
            var departmentOfSchool = department?.Path?.Split("/")[0];
            
            // lay danh sach giao vien trong bo mon
            var staffs = await staffRepository.FindAsync(
                new GetStaffByDepartmentCodeSpec(departmentCode),
                cancellationToken: cancellationToken);
            var staffOfSpec = await staffRepository.FindAsync(
                new GetStaffByDepartmentCodesSpec(departmentOfSpecificalStaff.Where(t => t.DepartmentCode != departmentCode).Select(e => e.DepartmentCode).ToList()),
                cancellationToken: cancellationToken);
            staffs.AddRange(staffOfSpec);
            
            // thoi khoa bieu cua mon can tim giao vien
            var courseClassSlotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByListCourseClassCodeSpec([request.CourseClassCode]),
                cancellationToken: cancellationToken);
            
            // lop cua cac giang vien trong bo mon
            var courseClassOfTeacher = await courseClassRepository.FindAsync(
                new GetCourseClassBySemesterCodeAndStageAndListStaffCodeSpec(request.SemesterCode, request.Stage,
                    staffs.Select(e => e.Code).ToList()),
                cancellationToken: cancellationToken);
            // lay lich day cua giao vien
            var staffSchedule = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByListCourseClassCodeSpec(courseClassOfTeacher.Select(e => e.CourseClassCode).ToList()),
                cancellationToken: cancellationToken);
            // tao map lich day: StaffCode -> HashSet<(DayOfWeek, Slot)>
            var staffSchedules = new Dictionary<string, HashSet<(int day, string slot)>>();
            foreach (var staff in staffs)
                staffSchedules[staff.Code] = new HashSet<(int, string)>();
            // cap nhat lich day cua giao vien da phan cong truoc do
            foreach (var courseClass in courseClassOfTeacher)
            {
                if (string.IsNullOrWhiteSpace(courseClass.TeacherCode)) continue;
                if (!staffSchedules.ContainsKey(courseClass.TeacherCode)) continue;
                var timelines = staffSchedule.Where(t => t.CourseClassCode == courseClass.CourseClassCode).ToList();
                foreach (var timeline in timelines)
                {
                    foreach (var slot in timeline.Slots)
                    {
                        staffSchedules[courseClass.TeacherCode].Add((timeline.DayOfWeek, slot));
                    }
                }
            }
            // tim giao vien con trong cho lop nay
            var result = new List<Staff>();
            foreach (var staff in staffs)
            {
                // neu giao vien da co lich day cho lop nay thi bo qua
                if (courseClassSlotTimelines.Any(t => t.Slots.Any(s => staffSchedules[staff.Code].Contains((t.DayOfWeek, s)))))
                    continue;
                // neu giao vien da day lop nay thi bo qua
                if (courseClassOfTeacher.Any(c => c.TeacherCode == staff.Code && c.CourseClassCode == request.CourseClassCode))
                    continue;
                result.Add(staff);
            }
            return ResultModel<ListResultModel<Staff>>.Create(
                ListResultModel<Staff>.Create(result, result.Count, 1, 10));
        }
    }
   
}