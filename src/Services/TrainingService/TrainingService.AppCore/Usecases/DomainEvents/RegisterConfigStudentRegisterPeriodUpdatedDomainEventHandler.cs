using Education.Contract.DomainEvents;
using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using Education.Infrastructure.Mongodb;
using MassTransit;
using MediatR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TrainingService.AppCore.StateMachine;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.DomainEvents;

public class
    RegisterConfigStudentRegisterPeriodUpdatedDomainEventHandler : INotificationHandler<
    RegisterConfigStudentRegisterPeriodUpdatedDomainEvent>
{
    private readonly ITopicProducer<StudentRegistrationStartedIntegrationEvent> _topicProducer;
    private readonly IMongoRepository<RegisterState> _repository;
    private readonly IMongoRepository<CourseClass> _repositoryCourseClass;
    private readonly IMongoRepository<SlotTimeline> _slotTimelineRepository;
    private readonly IMongoRepository<Subject> _subjectRepository;
    private readonly ITopicProducer<CourseClassesCreatedIntegrationEvent> _producer;
    private readonly IMongoRepository<Semester> _mongoRepository;
    
    public RegisterConfigStudentRegisterPeriodUpdatedDomainEventHandler(
        ITopicProducer<StudentRegistrationStartedIntegrationEvent> topicProducer, IOptions<MongoOptions> mnOptions,
        IMongoRepository<CourseClass> repositoryCourseClass, IMongoRepository<SlotTimeline> slotTimelineRepository,
        ITopicProducer<CourseClassesCreatedIntegrationEvent> producer, IMongoRepository<Subject> subjectRepository)
    {
        _topicProducer = topicProducer;
        _repositoryCourseClass = repositoryCourseClass;
        _slotTimelineRepository = slotTimelineRepository;
        _producer = producer;
        _subjectRepository = subjectRepository;
        _repository = new MongoRepositoryBase<RegisterState>(new MongoClient(mnOptions.Value.ToString())
            .GetDatabase(mnOptions.Value.Database)
            .GetCollection<RegisterState>("RegisterSaga"));
    }

    public async Task Handle(RegisterConfigStudentRegisterPeriodUpdatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        var spec = new GetRegisterStateBySemesterCodeSpec(notification.SemesterCode);
        var registerState = await _repository.FindOneAsync(spec, cancellationToken);
        await _topicProducer.Produce(new StudentRegistrationStartedIntegrationEvent
        {
            CorrelationId = registerState.CorrelationId,
            StudentRegisterStartDate = notification.StudentRegisterStart,
            StudentRegisterEndDate = notification.StudentRegisterEnd,
        }, cancellationToken);
        var courseClasses = await _repositoryCourseClass.FindAsync(
            new GetCourseClassBySemesterCodeSpec(notification.SemesterCode), cancellationToken);
        var courseClassOpens = new List<CourseClassEvent>();
        var semester = await _mongoRepository.FindOneAsync(
            new GetSemesterByCodeSpec(notification.SemesterCode), cancellationToken);
        foreach (var courseClass in courseClasses)
        {
            var subject = await _subjectRepository.FindOneAsync(
                new GetSubjectByCodeSpec(courseClass.SubjectCode), cancellationToken);
            var @class = courseClasses?.FirstOrDefault(e => e.CourseClassCode == courseClass.CourseClassCode);
            var slotTimelines = await _slotTimelineRepository.FindAsync(
                new GetSlotTimelineByCourseClassCodesSpec([courseClass?.CourseClassCode]), cancellationToken);
            
            // var weekStart = @class.CourseClassType == CourseClassType.Lecture
            //     ? subject.LectureStartWeek
            //     : subject.LabStartWeek;
            courseClassOpens.Add(new CourseClassEvent(
                @class.CourseClassCode,
                @class.CourseClassName,
                (int)@class.CourseClassType,
                @class.SubjectCode,
                subject.SubjectName,
                subject.NumberOfCredits,
                @class.TeacherCode,
                @class.TeacherName,
                @class.NumberStudentsExpected,
                1,
                @class.ParentCourseClassCode,
                (int)@class.Stage,
                slotTimelines.Select(e => new SlotTimelineEvent(e.BuildingCode, e.RoomCode, e.DayOfWeek, e.Slots)).ToList()
                ));    
        }
        await _producer.Produce(
            new CourseClassesCreatedIntegrationEvent(notification.SemesterCode, notification.StudentRegisterStart,
                notification.StudentRegisterEnd, semester.StartDate ?? throw new ArgumentNullException(), semester.EndDate ?? throw new ArgumentNullException(), courseClassOpens), cancellationToken);
        
    }
}