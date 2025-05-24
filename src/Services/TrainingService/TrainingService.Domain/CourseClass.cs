using Education.Contract.DomainEvents;
using Education.Core.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : AggregateBase
{
    public void Create(int classIndex, string courseClassCode, string courseClassName, CourseClassType courseClassType,
        string subjectCode, int sessionLength, int session, Guid correctionId, int durationInWeeks,
        int minDaySpaceLesson, string semesterCode, int numberStudents, SubjectTimelineStage stage, IDictionary<string, object> metaData = null)
    {
        ClassIndex = classIndex;
        CourseClassCode = courseClassCode;
        CourseClassName = courseClassName;
        CourseClassType = courseClassType;
        SubjectCode = subjectCode;
        SessionLength = sessionLength;
        Session = session;
        CorrectionId = correctionId;
        DurationInWeeks = durationInWeeks;
        MinDaySpaceLesson = minDaySpaceLesson;
        SemesterCode = semesterCode;
        NumberStudents = numberStudents;
        Stage = stage;
        AddDomainEvent(version => new CourseClassCreatedDomainEvent(Id.ToString(), classIndex, courseClassCode,
            courseClassName, (int)courseClassType, subjectCode, sessionLength, session, correctionId, durationInWeeks,
            minDaySpaceLesson, semesterCode, numberStudents, (int)stage)
        {
            Version = version,
            MetaData = metaData
        });
    }
    

    public int ClassIndex { get; set; } 
    public string CourseClassCode { get; set; }
    public string CourseClassName { get; set; }
    public List<string> StudentIds { get; set; } = [];
    public CourseClassType CourseClassType { get; set; }
    public string SubjectCode { get; set; }
    public int SessionLength { get; set; }
    public int Session { get; set; }
    public Guid CorrectionId { get; set; }
    public int DurationInWeeks { get; set; }
    public int MinDaySpaceLesson { get; set; }
    public string SemesterCode { get; set; }
    public int NumberStudents { get; set; }
    public SubjectTimelineStage Stage { get; set; } = SubjectTimelineStage.Stage1;

    
    
    
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