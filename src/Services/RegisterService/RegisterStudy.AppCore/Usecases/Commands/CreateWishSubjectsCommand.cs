using Education.Core.Domain;
using Education.Core.Services;
using Education.Core.Utils;
using Education.Infrastructure.Authentication;
using MediatR;
using RegisterStudy.Domain;

namespace RegisterStudy.AppCore.Usecases.Commands;

public record CreateWishSubjectsCommand(string EducationCode, List<string> SubjectCodes) : ICommand<IResult>
{
    internal class Handler(
        IClaimContextAccessor claimContextAccessor,
        IApplicationService<StudentRegister> service,
        IHttpContextAccessor httpContextAccessor)
        : IRequestHandler<CreateWishSubjectsCommand, IResult>
    {
        public IHttpContextAccessor HttpContextAccessor { get; } = httpContextAccessor;

        public async Task<IResult> Handle(CreateWishSubjectsCommand request, CancellationToken cancellationToken)
        {
            var (educationCode, subjectCodes) = request;
            var (userId, studentCode) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());

            var studentRegister = new StudentRegister();
            studentRegister.CreateStudentRegister(studentCode, DateTimeUtils.GetUtcTime(), educationCode, subjectCodes);
            await service.SaveEventStore(studentRegister, cancellationToken);
            return Results.Created();
        }
    }
}