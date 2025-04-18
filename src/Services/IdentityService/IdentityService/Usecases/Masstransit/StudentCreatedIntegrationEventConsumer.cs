
using Education.Contract.IntegrationEvents;
using IdentityService.Models;
using IdentityService.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Usecases.Masstransit;

public class StudentCreatedIntegrationEventConsumer(UserManager userManager)
    : INotificationHandler<StudentCreatedIntegrationEvent>
{
    public async Task Handle(StudentCreatedIntegrationEvent notification, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(c => c.UserId == notification.UserId,
            cancellationToken: cancellationToken);
        if (user == null)
        {
            await userManager.CreateAsync(new ApplicationUser()
            {
                Id = notification.UserId,
                UserName = notification.StudentCode,
                UserId = notification.UserId,
            }, notification.StudentCode);    
        }
    }
}