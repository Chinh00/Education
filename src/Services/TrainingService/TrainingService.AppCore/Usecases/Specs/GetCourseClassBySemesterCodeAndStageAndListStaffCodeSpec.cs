using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassBySemesterCodeAndStageAndListStaffCodeSpec : SpecificationBase<CourseClass>
{
    public GetCourseClassBySemesterCodeAndStageAndListStaffCodeSpec(string semesterCode, int stage, List<string> staffCodes)
    {
        Predicate = courseClass => courseClass.SemesterCode == semesterCode &&
                                   (stage == 0 || stage == 2) ? courseClass.CourseClassCode.Contains("GD1") :
                                    (stage == 1 || stage == 3) && courseClass.CourseClassCode.Contains("GD2") &&
                                   staffCodes.Contains(courseClass.TeacherCode);
    }
    public override Expression<Func<CourseClass, bool>> Predicate { get; }
}