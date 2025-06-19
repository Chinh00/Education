using Education.Core.Domain;
using MongoDB.Bson;
using TrainingService.Domain.Enums;

namespace TrainingService.Domain;

public class CourseClass : BaseEntity
{
    public int Index { get; set; }
    public int WeekStart { get; set; } = 0;
    public int WeekEnd { get; set; } = 0;
    
    public CourseClassStatus Status { get; set; } =  CourseClassStatus.Active;

    public string CourseClassCode { get; set; }
    public string CourseClassName { get; set; }
    public List<string> StudentIds { get; set; } = [];
    public CourseClassType CourseClassType { get; set; }
    public string SubjectCode { get; set; }
    public List<int> SessionLengths { get; set; } = new(); 
    public int TotalSession { get; set; }
    public string SemesterCode { get; set; }
    public int NumberStudents { get; set; }
    public int NumberStudentsExpected { get; set; }
    public SubjectTimelineStage Stage { get; set; } = SubjectTimelineStage.Stage1;
    public string TeacherName { get; set; }
    public string TeacherCode { get; set; }
    
    public string ParentCourseClassCode { get; set; }

}

public class SlotTimeline : BaseEntity
{
    public string CourseClassCode { get; set; }
    public string BuildingCode { get; set; }
    public int StartWeek { get; set; } = 1;
    public int EndWeek { get; set; } = 8;
    
    public string RoomCode { get; set; }
    public int DayOfWeek { get; set; }
    public List<string> Slots { get; set; }
}