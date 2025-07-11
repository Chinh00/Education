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
        if (user == null)
        {
            Console.WriteLine("User not found, creating new user.");
        }

        if (user != null)
        {
            user.IsConfirm = true;
            Console.WriteLine("User found, updating confirmation status.");
            await userManager.UpdateAsync(user);
        }

        if (user != null) await userManager.AddToRoleAsync(user, "student");
    }
}