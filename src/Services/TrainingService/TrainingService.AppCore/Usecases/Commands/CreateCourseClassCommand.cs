using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateCourseClassCommand(
    
    string CourseClassCode, string CourseClassName, int CourseClassType,
    string SubjectCode,
    string SemesterCode,
    int NumberStudentsExpected,
    string ParentCourseClassCode,
    int Stage,
    int WeekStart,
    List<CreateCourseClassCommand.SlotTimelineModel> SlotTimelines
    ) : ICommand<IResult>
{
    public record struct SlotTimelineModel(string RoomCode, int DayOfWeek, List<string> Slot);
    internal class Handler(
        IMongoRepository<Subject> subjectRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineService,
        IClaimContextAccessor claimContextAccessor
        )
        : IRequestHandler<CreateCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(CreateCourseClassCommand request, CancellationToken cancellationToken)
        {
            var courseClass = new CourseClass();
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var subject = await subjectRepository.FindOneAsync(new GetSubjectByCodeSpec(request.SubjectCode), cancellationToken);
            
            
            
            switch ((CourseClassType)request.CourseClassType)
            {
                case Domain.Enums.CourseClassType.Lecture:
                {
                    courseClass.CourseClassCode = request.CourseClassCode;
                    courseClass.CourseClassName = request.CourseClassName;
                    courseClass.CourseClassType = (CourseClassType) request.CourseClassType;
                    courseClass.SubjectCode = subject.SubjectCode;
                    courseClass.TotalSession = subject.LectureTotal;
                    courseClass.SemesterCode = request.SemesterCode;
                    courseClass.NumberStudentsExpected = request.NumberStudentsExpected;
                    courseClass.ParentCourseClassCode = string.Empty;
                    courseClass.Stage = (SubjectTimelineStage)request.Stage;
                    courseClass.ParentCourseClassCode = request.ParentCourseClassCode;
                    courseClass.WeekStart = request.WeekStart;
                    
                    break;
                }
                case Domain.Enums.CourseClassType.Lab:
                {
                    courseClass.CourseClassCode = request.CourseClassCode;
                    courseClass.CourseClassName = request.CourseClassName;
                    courseClass.CourseClassType = (CourseClassType) request.CourseClassType;
                    courseClass.SubjectCode = subject.SubjectCode;
                    courseClass.TotalSession = subject.LabTotal;
                    courseClass.SemesterCode = request.SemesterCode;
                    courseClass.NumberStudentsExpected = request.NumberStudentsExpected;
                    courseClass.ParentCourseClassCode = string.Empty;
                    courseClass.Stage = (SubjectTimelineStage)request.Stage;
                    courseClass.ParentCourseClassCode = request.ParentCourseClassCode;
                    courseClass.WeekStart = request.WeekStart;
                    break;
                }
                
            }
            await courseClassRepository.AddAsync(courseClass, cancellationToken);
            
            
            foreach (var requestSlotTimeline in request.SlotTimelines)
            {
                var slotTimeline = new SlotTimeline
                {
                    CourseClassCode = courseClass.CourseClassCode,
                    BuildingCode = requestSlotTimeline.RoomCode,
                    RoomCode = requestSlotTimeline.RoomCode,
                    DayOfWeek = requestSlotTimeline.DayOfWeek,
                    Slots = requestSlotTimeline.Slot
                };
                
                await slotTimelineService.AddAsync(slotTimeline, cancellationToken);
            }
            return Results.Ok(ResultModel<CourseClass>.Create(courseClass));
        }
    }
}     