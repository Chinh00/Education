using Education.Core.Domain;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetRegisterCourseCurrentQuery : IQuery<RegisterCourse>
{
    internal class Handler(IRegisterRepository<RegisterCourse> registerRepository)
        : IRequestHandler<GetRegisterCourseCurrentQuery, ResultModel<RegisterCourse>>
    {

        public async Task<ResultModel<RegisterCourse>> Handle(GetRegisterCourseCurrentQuery request, CancellationToken cancellationToken)
        {
            return ResultModel<RegisterCourse>.Create(await registerRepository.GetAsync(nameof(RegisterCourse)) ?? null);
        }
    }
}