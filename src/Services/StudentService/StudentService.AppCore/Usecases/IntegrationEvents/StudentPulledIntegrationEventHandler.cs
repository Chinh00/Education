using Education.Contract.IntegrationEvents;
using Education.Core.Services;
using MediatR;
using StudentService.Domain;

namespace StudentService.AppCore.Usecases.IntegrationEvents;

public class StudentPulledIntegrationEventHandler(IApplicationService<Student> service)
    : INotificationHandler<StudentPulledIntegrationEvent>
{
    
    public async Task Handle(StudentPulledIntegrationEvent notification, CancellationToken cancellationToken)
    {
        
    }
}