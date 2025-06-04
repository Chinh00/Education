using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetRegisterCourseStateQuery(string EducationCode) : IQuery<StudentWishRegister>
{
    internal class Handler(IRegisterRepository<StudentWishRegister> registerRepository, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<GetRegisterCourseStateQuery, ResultModel<StudentWishRegister>>
    {
        public async Task<ResultModel<StudentWishRegister>> Handle(GetRegisterCourseStateQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetUsername();
            var key = RedisKey.GetKeyWishSubjects(studentCode, request.EducationCode);

            return ResultModel<StudentWishRegister>.Create(await registerRepository.GetOneAsync(key));
        }
    }
}