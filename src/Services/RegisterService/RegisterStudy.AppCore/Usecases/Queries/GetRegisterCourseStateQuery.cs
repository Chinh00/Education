using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetRegisterCourseStateQuery(string EducationCode) : IQuery<StudentRegister>
{
    internal class Handler(IRegisterRepository<StudentRegister> registerRepository, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<GetRegisterCourseStateQuery, ResultModel<StudentRegister>>
    {
        public async Task<ResultModel<StudentRegister>> Handle(GetRegisterCourseStateQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetUsername();
            var key = RedisKey.GetKeyWishSubjects(studentCode, request.EducationCode);

            return ResultModel<StudentRegister>.Create(await registerRepository.GetOneAsync(key));
        }
    }
}