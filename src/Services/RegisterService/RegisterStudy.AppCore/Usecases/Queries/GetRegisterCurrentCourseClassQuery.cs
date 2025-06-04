using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetRegisterCurrentCourseClassQuery
    : IQuery<StudentRegister>
{
    internal class Handler(
        IRegisterRepository<StudentRegister> registerRepository,
        IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<GetRegisterCurrentCourseClassQuery, ResultModel<StudentRegister>>
    {
        public async Task<ResultModel<StudentRegister>> Handle(GetRegisterCurrentCourseClassQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetUsername();
            return ResultModel<StudentRegister>.Create(
                await registerRepository.GetAsync(RedisKey.StudentRegisterCourseClass(studentCode)) ?? null);
        }
    }
}