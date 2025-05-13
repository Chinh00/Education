using Education.Core.Domain;
using Education.Core.Repository;
using Google.OrTools.Sat;
using MediatR;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record ScheduleCreateCommand : ICommand<IResult>
{
    internal class Handler : IRequestHandler<ScheduleCreateCommand, IResult>
    {
        private readonly IMongoRepository<Room> _roomRepository;
        private readonly IMongoRepository<StudentRegister> _studentRegisterRepository;

        public Handler(IMongoRepository<Room> roomRepository, IMongoRepository<StudentRegister> studentRegisterRepository)
        {
            _roomRepository = roomRepository;
            _studentRegisterRepository = studentRegisterRepository;
        }

        public async Task<IResult> Handle(ScheduleCreateCommand request, CancellationToken cancellationToken)
        {
            var model = new CpModel();
            var solver = new CpSolver();
            
            var subjectTimelineConfigs = new List<SubjectTimelineConfig>
            {
                new SubjectTimelineConfig
                {
                    SubjectCode = "CS101",
                    LectureLesson = 2,
                    LabLesson = 1,
                    LecturePeriod = 2,
                    LabPeriod = 2,
                    LectureMinStudent = 20,
                    LabMinStudent = 15
                },
                new SubjectTimelineConfig
                {
                    SubjectCode = "CS102",
                    LectureLesson = 3,
                    LabLesson = 2,
                    LecturePeriod = 3,
                    LabPeriod = 2,
                    LectureMinStudent = 25,
                    LabMinStudent = 15
                },
                new SubjectTimelineConfig
                {
                    SubjectCode = "MATH101",
                    LectureLesson = 2,
                    LabLesson = 1,
                    LecturePeriod = 3,
                    LabPeriod = 2,
                    LectureMinStudent = 30,
                    LabMinStudent = 20
                }
            };

            // Cấu hình lớp học
            var courseClasses = new List<CourseClass>
            {
                new CourseClass { ClassIndex = 0, SubjectCode = "CS101", CourseClassType = CourseClassType.Lecture },
                new CourseClass { ClassIndex = 1, SubjectCode = "CS101", CourseClassType = CourseClassType.Lab },
                new CourseClass { ClassIndex = 2, SubjectCode = "CS102", CourseClassType = CourseClassType.Lecture },
                new CourseClass { ClassIndex = 3, SubjectCode = "CS102", CourseClassType = CourseClassType.Lecture },
                new CourseClass { ClassIndex = 4, SubjectCode = "CS102", CourseClassType = CourseClassType.Lab },
                new CourseClass { ClassIndex = 5, SubjectCode = "MATH101", CourseClassType = CourseClassType.Lecture },
                new CourseClass { ClassIndex = 6, SubjectCode = "MATH101", CourseClassType = CourseClassType.Lab }
            };

            if (subjectTimelineConfigs == null) throw new ArgumentNullException(nameof(subjectTimelineConfigs));
            int totalDays = 6;
            int periodsPerDay = 15;


            foreach (var courseClass in courseClasses)
            {
                var config = subjectTimelineConfigs.First(c => c.SubjectCode == courseClass.SubjectCode);

                // Số buổi học mỗi tuần
                int sessionsPerWeek = courseClass.CourseClassType == CourseClassType.Lecture
                    ? config.LectureLesson
                    : config.LabLesson;

                // Số tiết mỗi buổi học
                int periodPerSession = courseClass.CourseClassType == CourseClassType.Lecture
                    ? config.LecturePeriod
                    : config.LabPeriod;

                // Khoảng cách tối thiểu giữa các buổi học
                int minDaySpacing = courseClass.CourseClassType == CourseClassType.Lecture
                    ? config.MinDaySpaceLecture
                    : config.MinDaySpaceLab;

                

                
            }

            
            
            throw new NotImplementedException();
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
                    totalStudents / (double)subjectRegister.LectureMinStudent);
                var totalLab = (int)Math.Ceiling(
                    totalStudents / (double)subjectRegister.LabMinStudent);
                for (var i = 0; i < totalLecture; i++)
                {
                    var lectureClass = new CourseClass
                    {
                        ClassIndex = i,
                        CourseClassType = CourseClassType.Lecture,
                        StudentIds = new List<string>(), 
                        SubjectCode = subjectRegister.SubjectCode,
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
                    };
                    courseClasses.Add(labClass);
                }
            }
            return courseClasses;
        }
    }
}