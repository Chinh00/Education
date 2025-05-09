using Education.Core.Domain;
using Education.Core.Utils;
using Education.Infrastructure.Authentication;
using GrpcServices;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record CreateWishSubjectsCommand(string EducationCode, List<string> SubjectCodes) : ICommand<IResult>
{
    internal class Handler(
        IRegisterRepository<StudentRegister> registerRepository,
        IClaimContextAccessor claimContextAccessor,
        Training.TrainingClient trainingClient,
        IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<CreateWishSubjectsCommand, IResult>
    {
        public async Task<IResult> Handle(CreateWishSubjectsCommand request, CancellationToken cancellationToken)
        {
            var studentCode = claimContextAccessor.GetName();
            var key = $"subjects:{studentCode}:{request.EducationCode}";
            var register = await registerRepository.GetAsync(key) ?? new StudentRegister()
            {
                StudentCode = studentCode,
                EducationCode = request.EducationCode,
                RegisterDate = DateTimeUtils.GetUtcTime(),
                SubjectCodes = request.SubjectCodes,
            };
            await registerRepository.SaveAsync(key, () => Task.FromResult(register));
            return Results.Ok(ResultModel<StudentRegister>.Create(register));
        }
    }
}