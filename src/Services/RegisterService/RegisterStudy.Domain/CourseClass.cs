namespace RegisterStudy.Domain;

public class CourseClass
{
    public string CourseClassCode { get; set; }
    public string CourseClassName { get; set; }
    public int CourseClassType { get; set; }
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public int NumberOfCredits { get; set; }
    public string TeacherCode { get; set; }
    public string TeacherName { get; set; }
    public string SemesterCode { get; set; }
    public List<string> Students { get; set; }
    public int Stage { get; set; }
    
    public List<SlotTime> SlotTimes { get; set; } = new();

}

public record SlotTime(
    string BuildingCode,
    string RoomCode,
    int DayOfWeek,
    List<string> Slot
);