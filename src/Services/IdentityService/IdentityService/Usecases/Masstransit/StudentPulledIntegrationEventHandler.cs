using Education.Contract.IntegrationEvents;
using IdentityService.Services;
using MediatR;

namespace IdentityService.Usecases.Masstransit;

public class StudentPulledIntegrationEventHandler(UserManager userManager)
    : INotificationHandler<StudentPulledIntegrationEvent>
{
    public async Task Handle(StudentPulledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByNameAsync(notification?.UserName ?? throw new InvalidOperationException());
        if (user != null)
        {
            user.IsConfirm = true;
            await userManager.UpdateAsync(user);
        }
    }
}