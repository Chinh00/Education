using Education.Contract.DomainEvents;
using MediatR;
using MongoDB.Bson;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.DomainEvents;

public class SubjectRegisterChangedDomainEventHandler(IRegisterRepository<StudentWishRegister> registerRepository)
    : INotificationHandler<SubjectRegisterChangedDomainEvent>
{
    public async Task Handle(SubjectRegisterChangedDomainEvent notification, CancellationToken cancellationToken)
    {
        var (id, studentCode, educationCode, subjectCode) = notification;
        var key = RedisKey.GetKeyWishSubjects(studentCode, educationCode);
        await registerRepository.SaveAsync(key, () => Task.FromResult(new StudentWishRegister()
        {
            Id = ObjectId.Parse(id),
            StudentCode = studentCode,
            EducationCode = educationCode,
            SubjectCodes = subjectCode
        }));
    }
}