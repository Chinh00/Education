using Education.Core.Domain;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record UpdateWishSubjectsCommand(string EducationCode, List<string> SubjectCodes) : ICommand<IResult>
{
    
    internal class Handler(
        IApplicationService<StudentRegister> service,
        IClaimContextAccessor claimContextAccessor,
        IRegisterRepository<StudentRegister> studentRegisterRepository)
        : IRequestHandler<UpdateWishSubjectsCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateWishSubjectsCommand request, CancellationToken cancellationToken)
        {
            var (educationCode, subjectCodes) = request;
            var (userId, studentCode) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            var spec = RedisKey.GetKeyWishSubjects(studentCode, educationCode);
            var studentRegister = await studentRegisterRepository.GetAsync(spec);
            var studentFromHistory = await service.ReplayAggregate(studentRegister.Id, cancellationToken);
            studentFromHistory.ChangeSubjectCode(subjectCodes);
            await service.SaveEventStore(studentFromHistory, cancellationToken);
            return Results.NoContent();
        }
    }
}