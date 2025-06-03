using Education.Core.Domain;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public class GetStudentRegisterQuery :  IQuery<RegisterCourseClass>
{
internal class Handler(IRegisterRepository<RegisterCourseClass> registerRepository)
    : IRequestHandler<GetStudentRegisterQuery, ResultModel<RegisterCourseClass>>
{
    public async Task<ResultModel<RegisterCourseClass>> Handle(GetStudentRegisterQuery request, CancellationToken cancellationToken)
    {
        return ResultModel<RegisterCourseClass>.Create(await registerRepository.GetAsync(nameof(RegisterCourseClass)) ?? null);
    }
}
}