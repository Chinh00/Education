using Education.Core.Repository;
using Education.Infrastructure.Mongodb.Internal;
using StudentService.Domain;

namespace StudentService.Infrastructure;

public class StudentSeedService(IServiceScopeFactory scopeFactory) : DataSeedHostedService<Student>(scopeFactory)
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await base.ExecuteAsync(stoppingToken);
        using var scope = scopeFactory.CreateScope();
        var mongoRepository = scope.ServiceProvider.GetService<IMongoRepository<Student>>();
        await mongoRepository.AddAsync(new Student()
        {
            PersonalInformation = new PersonalInformation()
            {
                FirstName = "Nguyễn",
                LastName = "Chinh",
                FullName = "Nguyen Van Chinh",
                Gender = PersonGender.Female
            },
            InformationBySchool = new ()
            {
                StudentCode = "2151062726"
            }
        }, stoppingToken);
    }
}