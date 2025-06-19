using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.Mongodb;
using MassTransit;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateRegistrationPeriodCommand(CreateRegistrationPeriodCommand.CreateRegistrationPeriodModel Model)
    : ICommand<IResult>
{
    public record struct CreateRegistrationPeriodModel(
        string SemesterCode,
        DateTime StudentRegistrationStartDate,
        DateTime StudentRegistrationEndDate
    );
    
    
    internal class Handler
        : IRequestHandler<CreateRegistrationPeriodCommand, IResult>
    {
        private readonly IClaimContextAccessor _claimContextAccessor;
        private readonly ITopicProducer<StudentRegistrationStartedIntegrationEvent> _topicProducer;
        private readonly IMongoRepository<RegisterState> _repository;
        private readonly IMongoRepository<CourseClass> _repositoryCourseClass;
        private readonly IMongoRepository<Semester> _semesterRepository;
        private readonly IMongoRepository<Subject> _subjectRepository;
        private readonly IMongoRepository<SlotTimeline> _slotTimelineRepository;
        private readonly ITopicProducer<CourseClassesCreatedIntegrationEvent> _producer;
        public Handler(IClaimContextAccessor claimContextAccessor,
            ITopicProducer<StudentRegistrationStartedIntegrationEvent> topicProducer,
            IOptions<MongoOptions> mnOptions, IMongoRepository<CourseClass> repositoryCourseClass,
            IMongoRepository<Semester> semesterRepository, IMongoRepository<Subject> subjectRepository,
            IMongoRepository<SlotTimeline> slotTimelineRepository, ITopicProducer<CourseClassesCreatedIntegrationEvent> producer)
        {
            _claimContextAccessor = claimContextAccessor;
            _topicProducer = topicProducer;
            _repositoryCourseClass = repositoryCourseClass;
            _semesterRepository = semesterRepository;
            _subjectRepository = subjectRepository;
            _slotTimelineRepository = slotTimelineRepository;
            _producer = producer;
            _repository = new MongoRepositoryBase<RegisterState>(new MongoClient(mnOptions.Value.ToString())
                .GetDatabase(mnOptions.Value.Database)
                .GetCollection<RegisterState>("Register"));
        }


        public async Task<IResult> Handle(CreateRegistrationPeriodCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (_claimContextAccessor.GetUserId(), _claimContextAccessor.GetUsername());
            
            var spec = new GetRegisterStateBySemesterCodeSpec(request.Model.SemesterCode);
            var registerState = await _repository.FindOneAsync(spec, cancellationToken);
            
            
            await _topicProducer.Produce(new StudentRegistrationStartedIntegrationEvent
            {
                CorrelationId = registerState.CorrelationId,
                StudentRegisterStartDate = request.Model.StudentRegistrationStartDate,
                StudentRegisterEndDate = request.Model.StudentRegistrationEndDate,
            }, cancellationToken);
            
            
            
            
            
            var courseClasses = await _repositoryCourseClass.FindAsync(
                new GetCourseClassBySemesterCodeSpec(request.Model.SemesterCode), cancellationToken);
            var courseClassOpens = new List<CourseClassEvent>();
            var semester = await _semesterRepository.FindAsync(
                new GetSemesterTreeSpec(request.Model.SemesterCode), cancellationToken);
            var semesterStage1 = semester.Where(c => c.SemesterCode != request.Model.SemesterCode).FirstOrDefault(c => c.SemesterCode.Split("_")[3] == "1");
            var semesterStage2 = semester.Where(c => c.SemesterCode != request.Model.SemesterCode).FirstOrDefault(c => c.SemesterCode.Split("_")[3] == "2");
            
            foreach (var courseClass in courseClasses)
            {
                var subject = await _subjectRepository.FindOneAsync(
                    new GetSubjectByCodeSpec(courseClass.SubjectCode), cancellationToken);
                
                
                
                var slotTimelines = await _slotTimelineRepository.FindAsync(
                    new GetSlotTimelineByCourseClassCodesSpec([courseClass?.CourseClassCode]), cancellationToken);
            
                
                var (startDate, endDate) = courseClass.Stage switch
                {
                    SubjectTimelineStage.Stage1 => (semesterStage1?.StartDate, semesterStage1?.EndDate),
                    SubjectTimelineStage.Stage2 => (semesterStage2?.StartDate, semesterStage2?.EndDate),
                    SubjectTimelineStage.Stage1Of2 => (semesterStage1?.StartDate, semesterStage1?.EndDate),
                    SubjectTimelineStage.Stage2Of2 => (semesterStage2?.StartDate, semesterStage2?.EndDate),
                    SubjectTimelineStage.StageBoth => (semesterStage1?.StartDate, semesterStage2?.EndDate),
                    
                    _ => throw new ArgumentOutOfRangeException()
                };
                
                courseClassOpens.Add(new CourseClassEvent(
                    courseClass.CourseClassCode,
                    courseClass.CourseClassName,
                    (int)courseClass.CourseClassType,
                    courseClass.SubjectCode,
                    subject.SubjectName,
                    subject.NumberOfCredits,
                    courseClass.TeacherCode,
                    courseClass.TeacherName,
                    courseClass.NumberStudentsExpected,
                    courseClass.WeekStart,
                    courseClass.WeekEnd,
                    courseClass?.ParentCourseClassCode ?? "",
                    (int)courseClass.Stage, startDate ?? throw new ArgumentNullException(),
                    endDate ?? throw new ArgumentNullException(),
                    slotTimelines.Select(e =>
                            new SlotTimelineEvent(e.BuildingCode, e.RoomCode, e.DayOfWeek, e.Slots, e.StartWeek,
                                e.EndWeek))
                        .ToList()
                ));    
                
                
            }
            await _producer.Produce(
                new CourseClassesCreatedIntegrationEvent(request.Model.SemesterCode, request.Model.StudentRegistrationStartDate,
                    request.Model.StudentRegistrationEndDate, courseClassOpens), cancellationToken);
            
            
            return Results.Ok(ResultModel<RegisterState>.Create(registerState));
            
        }
    }
}