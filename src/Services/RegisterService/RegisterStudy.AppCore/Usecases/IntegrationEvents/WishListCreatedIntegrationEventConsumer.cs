using Education.Contract.IntegrationEvents;
using Education.Core.Utils;
using Hangfire;
using MediatR;
using RegisterStudy.Domain;
using RegisterStudy.Domain.Repository;

namespace RegisterStudy.AppCore.Usecases.IntegrationEvents;

public class WishListCreatedIntegrationEventConsumer(IBackgroundJobClient jobClient, IRegisterRepository<RegisterCourse> registerRepository)
    : INotificationHandler<WishListCreatedIntegrationEvent>
{
    public async Task Handle(WishListCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var delay = TimeZoneInfo
            .ConvertTimeFromUtc(notification.EndDate, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")) - DateTimeUtils.GetUtcTime();
        if (delay <= TimeSpan.Zero) await Task.CompletedTask;
        await registerRepository.SaveAsync(nameof(RegisterCourse), () => Task.FromResult(new RegisterCourse()
        {
            SemesterCode = notification.SemesterCode,
            StaDate = notification.StartDate,
            EndDate = notification.EndDate,
            MinCredit = notification.MinCredit,
            MaxCredit = notification.MaxCredit,
            RegisterCode = notification.CorrelationId.ToString(),
        }));
        jobClient.Schedule<WishLockHandler>(
            (x) => x.Handle(notification.CorrelationId, cancellationToken),
            delay
        );
    }
}