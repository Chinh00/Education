using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateCourseClassCommand(
    
    string CourseClassCode, string CourseClassName, int CourseClassType,
    string SubjectCode,
    string SemesterCode,
    List<CreateCourseClassCommand.SlotTimelineModel> SlotTimelines
    ) : ICommand<IResult>
{
    public record struct SlotTimelineModel(string RoomCode, int DayOfWeek, List<string> Slot);
    internal class Handler(
        IApplicationService<CourseClass> service,
        IApplicationService<SlotTimeline> slotTimelineService,
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<SubjectTimelineConfig> subjectRepository
        )
        : IRequestHandler<CreateCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(CreateCourseClassCommand request, CancellationToken cancellationToken)
        {
            var courseClass = new CourseClass();
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var subjectTimelineConfig = new GetSubjectTimelineBySubjectCodeSpec(request.SubjectCode);
            var subjectTimeline = await subjectRepository.FindOneAsync(subjectTimelineConfig, cancellationToken);

            switch ((CourseClassType)request.CourseClassType)
            {
                case Domain.Enums.CourseClassType.Lecture:
                {
                    courseClass.Create(request.CourseClassCode, request.CourseClassName, (CourseClassType) request.CourseClassType, request.SubjectCode,
                        subjectTimeline.LecturePeriod, subjectTimeline.LectureLesson, subjectTimeline.LectureTotal
                        , request.SemesterCode, subjectTimeline.Stage,
                        new Dictionary<string, object>()
                        {
                            { nameof(KeyMetadata.PerformedBy), userId },
                            { nameof(KeyMetadata.PerformedByName), userName }
                        });
            
            
                    await service.SaveEventStore(courseClass, cancellationToken);
                    break;
                }
                case Domain.Enums.CourseClassType.Lab:
                {
                    courseClass.Create(request.CourseClassCode, request.CourseClassName, (CourseClassType) request.CourseClassType, request.SubjectCode,
                        subjectTimeline.LabPeriod, subjectTimeline.LabLesson, subjectTimeline.LabTotal
                        , request.SemesterCode, subjectTimeline.Stage,
                        new Dictionary<string, object>()
                        {
                            { nameof(KeyMetadata.PerformedBy), userId },
                            { nameof(KeyMetadata.PerformedByName), userName }
                        });
            
                    await service.SaveEventStore(courseClass, cancellationToken);
                    break;
                }
                
            }
            
            foreach (var requestSlotTimeline in request.SlotTimelines)
            {
                var slotTimeline = new SlotTimeline();
                slotTimeline.Create(request.CourseClassCode, "",
                    requestSlotTimeline.RoomCode, requestSlotTimeline.DayOfWeek, requestSlotTimeline.Slot, new Dictionary<string, object>()
                    {
                        { nameof(KeyMetadata.PerformedBy), userId },
                        { nameof(KeyMetadata.PerformedByName), userName }
                    });
                await slotTimelineService.SaveEventStore(slotTimeline, cancellationToken);
            }
            return Results.Ok(ResultModel<CourseClass>.Create(courseClass));
        }
    }
}     