namespace RegisterStudy.AppCore.Usecases.Common;

public class RedisKey
{
    private const string WishSubjects = "subjects";
    public static string GetKeyWishSubjects(string studentCode, string educationCode) => $"{WishSubjects}:{studentCode}:{educationCode}";
    public static string GetStudentCodeFromKey(string studentCode, string educationCode) => $"{WishSubjects}:{studentCode}:{educationCode}";
    public static string GetEducationCodeFromKey(string studentCode, string educationCode) => $"{WishSubjects}:{studentCode}:{educationCode}";
    public static string SubjectCourseClass(string semesterCode, string subjectCode, string courseClassCode) => $"courseClass:{semesterCode}:{subjectCode}:{courseClassCode}";
    public static string StudentRegisterCourseClass(string studentCode) => $"studentRegister:{studentCode}";
    public static string StudentRegister => $"studentRegister";
}