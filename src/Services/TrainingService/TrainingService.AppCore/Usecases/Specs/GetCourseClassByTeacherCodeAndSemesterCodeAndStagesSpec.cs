using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassByTeacherCodeAndSemesterCodeAndStagesSpec(string teacherCode , string semesterCode, List<int> stages) : SpecificationBase<CourseClass>
{
    public override Expression<Func<CourseClass, bool>> Predicate =>
        courseClass => courseClass.TeacherCode == teacherCode && courseClass.SemesterCode == semesterCode &&
                       stages.Contains((int)courseClass.Stage);
}