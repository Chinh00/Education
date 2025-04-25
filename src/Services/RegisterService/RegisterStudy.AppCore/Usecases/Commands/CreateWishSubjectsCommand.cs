using Education.Core.Domain;
using Education.Core.Utils;
using Education.Infrastructure.Authentication;
using GrpcServices;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record CreateWishSubjectsCommand(List<string> SubjectCodes) : ICommand<IResult>
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
            var listSubjects = new List<SubjectRegister>();
            foreach (var subjectCode in request.SubjectCodes)
            {
                var subject = await trainingClient.getSubjectByCodeAsync(new GetSubjectByCodeRequest() { SubjectCode = subjectCode },
                    cancellationToken: cancellationToken);
                if (subject is null)
                {
                    return Results.NotFound($"Không tìm thấy môn học {subjectCode}.");
                }

                listSubjects.Add(new SubjectRegister()
                {
                    SubjectCode = subject.SubjectCode,
                    SubjectName = subject.SubjectName
                });
            }
            var key = $"subjects:{studentCode}";
            var register = await registerRepository.GetAsync(key) ?? new StudentRegister() ;
            register.StudentCode = studentCode;
            register.Subjects = listSubjects;
            register.RegisterDate = DateTimeUtils.GetUtcTime();
            await registerRepository.SaveAsync(key, () => Task.FromResult(register));
            
            return Results.Ok(ResultModel<StudentRegister>.Create(register));
        }
    }
}