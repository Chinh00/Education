using Education.Contract.DomainEvents;
using Education.Core.Domain;
using MongoDB.Bson;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : BaseEntity
{
    public void Create(string courseClassCode, string courseClassName, CourseClassType courseClassType,
        string subjectCode, int sessionLength, int session, int totalSession, string semesterCode, int numberStudentsExpected,
        string parentCourseClassCode,
        SubjectTimelineStage stage)
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
        NumberStudentsExpected = numberStudentsExpected;
        ParentCourseClassCode = parentCourseClassCode;
        
    }


    


    public int LectureStartWeek { get; set; } = 0;

    public int LabStartWeek { get; set; } = 1;
    
    
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
    public int NumberStudentsExpected { get; set; }
    public SubjectTimelineStage Stage { get; set; } = SubjectTimelineStage.Stage1;
    public string TeacherName { get; set; }
    public string TeacherCode { get; set; }
    
    public string ParentCourseClassCode { get; set; }
    

    
    
    
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