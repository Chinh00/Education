using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetSubjectScheduleConfigSpec : ListSpecificationBase<SubjectScheduleConfig>
{
    public GetSubjectScheduleConfigSpec(IListQuery<ListResultModel<SubjectScheduleConfig>> query)
    {
        ApplyFilters(query.Filters);;
        ApplyIncludes(query.Includes);
        ApplySorting(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.SubjectCode);
        ApplyInclude(c => c.SemesterCode);
        ApplyInclude(c => c.TotalTheoryCourseClass);
        ApplyInclude(c => c.Stage);
        ApplyInclude(c => c.TheoryTotalPeriod);
        ApplyInclude(c => c.PracticeTotalPeriod);
        ApplyInclude(c => c.TheorySessions);
        ApplyInclude(c => c.PracticeSessions);
        ApplyInclude(c => c.WeekStart);
        ApplyInclude(c => c.SessionPriority);
        ApplyInclude(c => c.LectureRequiredConditions);
        ApplyInclude(c => c.LabRequiredConditions);
    }
}