using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetStudentRegistersSpec : ListSpecificationBase<StudentRegister> 
{
    public GetStudentRegistersSpec(IListQuery<ListResultModel<StudentRegister>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.StudentCode);
        ApplyInclude(c => c.CorrelationId);
        ApplyInclude(c => c.EducationCode);
        ApplyInclude(c => c.SubjectCodes);
        ApplyInclude(c => c.RegisterDate);
    }
}