using Education.Core.Domain;
using MediatR;

namespace RegisterStudy.AppCore.Usecases.Commands;

public class RegisterSubjectCommand : ICommand<IResult>
{
    public readonly record struct RegisterSubjectModel(string CourseCode, string SubjectCode);
    
    
    internal class Handler : IRequestHandler<RegisterSubjectCommand, IResult>
    {
        public Task<IResult> Handle(RegisterSubjectCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}