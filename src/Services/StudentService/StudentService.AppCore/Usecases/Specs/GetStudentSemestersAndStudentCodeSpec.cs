using Education.Core.Domain;
using Education.Core.Specification;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.Specs;

public class GetStudentSemestersAndStudentCodeSpec : ListSpecificationBase<StudentSemester>
{
    public GetStudentSemestersAndStudentCodeSpec(IListQuery<ListResultModel<StudentSemester>> query, string studentCode)
    {
        ApplyFilter(c => c.StudentCode == studentCode);
        ApplyFilters(query.Filters);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyPaging(query.Page, query.PageSize);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.StudentCode);
        ApplyInclude(c => c.SemesterCode);
        ApplyInclude(c => c.SemesterName);
        ApplyInclude(c => c.EducationStartDate);
        ApplyInclude(c => c.EducationEndDate);
    }
}