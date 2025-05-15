using Education.Contract.IntegrationEvents;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Masstransits;
    

public class RegisterLockedIntegrationEventConsumer(
    IMongoRepository<StudentRegister> studentRegisterRepository,
    ITopicProducer<WishListLockedIntegrationEvent> producer)
    : INotificationHandler<RegisterLockedIntegrationEvent>
{
    public async Task Handle(RegisterLockedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        
        foreach (var studentRegisterConfirm in notification.Students)
        {
            var studentRegister =
                await studentRegisterRepository.FindOneAsync(
                    new GetStudentRegisterByStudentCodeAndEducationCodeSpec(studentRegisterConfirm.StudentCode,
                        studentRegisterConfirm.EducationCode), cancellationToken) ??
                new StudentRegister()
                {
                    CorrelationId = notification.CorrelationId,
                    StudentCode = studentRegisterConfirm.StudentCode,
                    EducationCode = studentRegisterConfirm.EducationCode,
                    RegisterDate = studentRegisterConfirm.RegisterDate,
                    SubjectCodes = studentRegisterConfirm.SubjectCodes,
                };
            await studentRegisterRepository.UpsertOneAsync(
                new GetStudentRegisterByStudentCodeAndEducationCodeSpec(studentRegister.StudentCode,
                    studentRegister.EducationCode), studentRegister,
                cancellationToken);
        }

        await producer.Produce(new { notification.CorrelationId }, cancellationToken);


    }
}