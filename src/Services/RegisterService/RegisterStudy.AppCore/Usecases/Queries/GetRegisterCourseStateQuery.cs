using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Queries;

public record GetRegisterCourseStateQuery : IQuery<StudentRegister>
{
    internal class Handler(IRegisterRepository<StudentRegister> registerRepository, IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<GetRegisterCourseStateQuery, ResultModel<StudentRegister>>
    {
        public async Task<ResultModel<StudentRegister>> Handle(GetRegisterCourseStateQuery request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetName();
            return ResultModel<StudentRegister>.Create(await registerRepository.GetOneAsync($"subjects:{studentCode}:*"));
        }
    }
}