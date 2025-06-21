using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Core.Specification;
using Education.Infrastructure.Authentication;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateCourseClassCommand(
    
    string CourseClassCode, 
    string CourseClassName, 
    int CourseClassType,
    string SubjectCode,
    string SemesterCode,
    int NumberStudentsExpected,
    string ParentCourseClassCode,
    int Stage,
    int WeekStart,
    int WeekEnd,
    List<int> SessionLengths) : ICommand<IResult>
{
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
            var courseClassIndex = await courseClassRepository.FindAsync(
                new TrueSpecificationBase<CourseClass>(), cancellationToken);
            
            var maxIndex = courseClassIndex.Any() ? courseClassIndex.Max(x => x.Index) : 0;
            switch ((CourseClassType)request.CourseClassType)
            {
                case Domain.Enums.CourseClassType.Lecture:
                {
                    courseClass.CourseClassCode = request.CourseClassCode;
                    courseClass.CourseClassName = request.CourseClassName;
                    courseClass.CourseClassType = (CourseClassType) request.CourseClassType;
                    courseClass.SubjectCode = subject.SubjectCode;
                    courseClass.SemesterCode = request.SemesterCode;
                    courseClass.NumberStudentsExpected = request.NumberStudentsExpected;
                    courseClass.ParentCourseClassCode = string.Empty;
                    courseClass.Stage = (SubjectTimelineStage)request.Stage;
                    courseClass.ParentCourseClassCode = request.ParentCourseClassCode;
                    courseClass.WeekStart = request.WeekStart;
                    courseClass.WeekEnd = request.WeekEnd;
                    courseClass.SessionLengths = request.SessionLengths;
                    
                    break;
                }
                case Domain.Enums.CourseClassType.Lab:
                {
                    courseClass.CourseClassCode = request.CourseClassCode;
                    courseClass.CourseClassName = request.CourseClassName;
                    courseClass.CourseClassType = (CourseClassType) request.CourseClassType;
                    courseClass.SubjectCode = subject.SubjectCode;
                    courseClass.SemesterCode = request.SemesterCode;
                    courseClass.NumberStudentsExpected = request.NumberStudentsExpected;
                    courseClass.ParentCourseClassCode = string.Empty;
                    courseClass.Stage = (SubjectTimelineStage)request.Stage;
                    courseClass.ParentCourseClassCode = request.ParentCourseClassCode;
                    courseClass.WeekStart = request.WeekStart;
                    courseClass.WeekEnd = request.WeekEnd;
                    courseClass.Index = maxIndex + 1;
                    courseClass.SessionLengths = request.SessionLengths;
                    break;
                }
                
            }
            await courseClassRepository.AddAsync(courseClass, cancellationToken);
            
            return Results.Ok(ResultModel<CourseClass>.Create(courseClass));
        }
    }
}     