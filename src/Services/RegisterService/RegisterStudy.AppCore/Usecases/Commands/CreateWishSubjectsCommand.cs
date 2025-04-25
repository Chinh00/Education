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
            };
            var firstOrDefault = register.SubjectRegisters?.FirstOrDefault(c => c.EducationCode == request.EducationCode);
            if (firstOrDefault is null)
            {
                register.SubjectRegisters?.Add(new SubjectRegister() { EducationCode = request.EducationCode, RegisterDate = DateTimeUtils.GetUtcTime()});
            }

            foreach (var subjectCode in request.SubjectCodes)
            {
                var subject = await trainingClient.getSubjectByCodeAsync(new GetSubjectByCodeRequest() { SubjectCode = subjectCode },
                    cancellationToken: cancellationToken);
                if (subject is null)
                {
                    return Results.NotFound($"Không tìm thấy môn học {subjectCode}.");
                }

                register.SubjectRegisters?.FirstOrDefault(c => c.EducationCode == request.EducationCode)?.SubjectCodes.Add(subjectCode);
            }
            await registerRepository.SaveAsync(key, () => Task.FromResult(register));
            
            return Results.Ok(ResultModel<StudentRegister>.Create(register));
        }
    }
}