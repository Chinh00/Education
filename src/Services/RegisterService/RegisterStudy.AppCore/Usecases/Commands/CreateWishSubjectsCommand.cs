using Education.Core.Domain;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Repository;
using RegisterStudy.Domain;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record CreateWishSubjectsCommand : ICommand<IResult>
{
    internal class Handler(
        IRegisterRepository<StudentRegister> registerRepository,
        IClaimContextAccessor claimContextAccessor)
        : IRequestHandler<CreateWishSubjectsCommand, IResult>
    {
        
        public async Task<IResult> Handle(CreateWishSubjectsCommand request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetUsername();

            return Results.Ok(ResultModel<string>.Create(studentCode));
        }
    }
}