using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : AggregateBase
{
    public void Create(string courseClassCode, string courseClassName, CourseClassType courseClassType,
        string subjectCode, int sessionLength, int session, int totalSession, string semesterCode,
        SubjectTimelineStage stage, IDictionary<string, object> metaData = null)
    {
        CourseClassCode = courseClassCode;
        CourseClassName = courseClassName;
        CourseClassType = courseClassType;
        SubjectCode = subjectCode;
        SessionLength = sessionLength;
        Session = session;
        SemesterCode = semesterCode;
        TotalSession = totalSession;
        Status = CourseClassStatus.Active;
        Stage = stage;
        AddDomainEvent(version => new CourseClassCreatedDomainEvent(Id.ToString(), courseClassCode,
            courseClassName, (int)courseClassType, subjectCode, sessionLength, session, totalSession, semesterCode, (int)stage)
        {
            Version = version,
            MetaData = metaData
        });
    }

    public override void ApplyDomainEvent(IDomainEvent @event) => Apply((dynamic)@event);

    void Apply(CourseClassCreatedDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        CourseClassCode = @event.CourseClassCode;
        CourseClassName = @event.CourseClassName;
        CourseClassType = (CourseClassType)@event.CourseClassType;
        SubjectCode = @event.SubjectCode;
        SessionLength = @event.SessionLength;
        Session = @event.Session;
        SemesterCode = @event.SemesterCode;
        TotalSession = @event.TotalSession;
        Stage = (SubjectTimelineStage)@event.Stage;
        Version = @event.Version;
    }

    void Apply(CourseClassAssignedTeacherDomainEvent @event)
    {
        Id = ObjectId.Parse(@event.AggregateId);
        TeacherCode = @event.TeacherCode;
        TeacherName = @event.TeacherName;
        Version = @event.Version;
    }

    public void AssignTeacher(string teacherCode,  string teacherName, IDictionary<string, object> metaData = null)
    {
        TeacherCode = teacherCode;
        TeacherName = teacherName;
        AddDomainEvent(version => new CourseClassAssignedTeacherDomainEvent(Id.ToString(), teacherCode, teacherName)
        {
            Version = version,
            MetaData = metaData
        });
    }
    
    public CourseClassStatus Status { get; set; } =  CourseClassStatus.Active;

    public string CourseClassCode { get; set; }
    public string CourseClassName { get; set; }
    public List<string> StudentIds { get; set; } = [];
    public CourseClassType CourseClassType { get; set; }
    public string SubjectCode { get; set; }
    public int SessionLength { get; set; }
    public int TotalSession { get; set; }
    public int Session { get; set; }
    public string SemesterCode { get; set; }
    public int NumberStudents { get; set; }
    public SubjectTimelineStage Stage { get; set; } = SubjectTimelineStage.Stage1;
    public string TeacherName { get; set; }
    public string TeacherCode { get; set; }
    
    

    
    
    
}

public class SlotTimeline : AggregateBase
{
    public string CourseClassCode { get; set; }
    public string BuildingCode { get; set; }
    
    public string RoomCode { get; set; }
    public int DayOfWeek { get; set; }
    public List<string> Slots { get; set; }
    
    public void Create(string courseClassCode, string buildingCode, string roomCode, int dayOfWeek, List<string> slot, IDictionary<string, object> metaData = null)
    {
        CourseClassCode = courseClassCode;
        BuildingCode = buildingCode;
        RoomCode = roomCode;
        DayOfWeek = dayOfWeek;
        Slots = slot;
        AddDomainEvent(version => new SlotTimelineCreatedDomainEvent(Id.ToString(), courseClassCode, buildingCode, roomCode, dayOfWeek, slot)
        {
            Version = version,
            MetaData = metaData
        });
    }
}