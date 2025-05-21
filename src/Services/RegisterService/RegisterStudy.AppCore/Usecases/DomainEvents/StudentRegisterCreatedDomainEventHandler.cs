using Education.Contract.DomainEvents;
using Education.Core.Utils;
using MediatR;
using MongoDB.Bson;
using RegisterStudy.AppCore.Usecases.Common;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.DomainEvents;

public class StudentRegisterCreatedDomainEventHandler(IRegisterRepository<StudentRegister> registerRepository)
    : INotificationHandler<StudentRegisterCreatedDomainEvent>
{
    public async Task Handle(StudentRegisterCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        var (aggregateId, studentCode, registerDate, educationCode, subjectCodes) = notification;
        var key = RedisKey.GetKeyWishSubjects(studentCode, educationCode);
        
        
        var register = await registerRepository.GetAsync(key) ?? new StudentRegister()
        {
            Id = ObjectId.Parse(notification.AggregateId),
            StudentCode = studentCode ,
            EducationCode = educationCode,
            RegisterDate = registerDate,
            SubjectCodes = subjectCodes,
        };
        await registerRepository.SaveAsync(key, () => Task.FromResult(register));
    }
}