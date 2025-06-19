using System.Linq.Expressions;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetCourseClassBySemesterCodeAndListStageAnsSubjectCodeSpec(
    string semesterCode,
    string subjectCode,
    List<int> stages) : SpecificationBase<CourseClass>
{
    
    public override Expression<Func<CourseClass, bool>> Predicate =>
        courseClass => courseClass.SemesterCode == semesterCode && subjectCode == courseClass.SubjectCode && stages.Contains((int)courseClass.Stage) && courseClass.ParentCourseClassCode == null;
}