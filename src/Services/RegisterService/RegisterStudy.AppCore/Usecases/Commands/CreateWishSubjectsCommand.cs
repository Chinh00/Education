using Education.Core.Domain;
using Education.Core.Services;
using Education.Core.Utils;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record CreateWishSubjectsCommand(string EducationCode, List<string> SubjectCodes) : ICommand<IResult>
{
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IRegisterRepository<StudentWishRegister> registerRepository)
        : IRequestHandler<CreateWishSubjectsCommand, IResult>
    {

        public async Task<IResult> Handle(CreateWishSubjectsCommand request, CancellationToken cancellationToken)
        {
            var (educationCode, subjectCodes) = request;
            var (userId, studentCode) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var key = RedisKey.GetKeyWishSubjects(studentCode, educationCode);

            var register = await registerRepository.GetAsync(key) ?? new StudentWishRegister()
            {
                StudentCode = studentCode ,
                EducationCode = educationCode,
                RegisterDate = DateTime.UtcNow,
                SubjectCodes = subjectCodes.Distinct().ToList(),
            };
            register.SubjectCodes = subjectCodes.Distinct().ToList();
            register.RegisterDate = DateTime.UtcNow;
            await registerRepository.SaveAsync(key, () => Task.FromResult(register));
            return Results.Created();
        }
    }
}