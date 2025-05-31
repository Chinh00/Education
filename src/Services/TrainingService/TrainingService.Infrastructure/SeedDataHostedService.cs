using Education.Core.Repository;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.Infrastructure;

public class SeedDataHostedService(IServiceScopeFactory serviceScopeFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IMongoRepository<CourseClassCondition>>();
        foreach (var courseClassCondition in _courseClassConditions)
        {
            var spec = new GetCourseClassConditionByCodeSpec(courseClassCondition.ConditionCode);
            var condition = await repository.FindOneAsync(spec, cancellationToken);
            if (condition == null)
            {
                await repository.AddAsync(courseClassCondition, cancellationToken);
            }
        }
        
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    private readonly List<CourseClassCondition> _courseClassConditions = new List<CourseClassCondition>()
    {
        new CourseClassCondition()
        {
            ConditionName = "Ngoài trời",
            ConditionCode = "Outdoor"
        },
        new CourseClassCondition()
        {
            ConditionName = "Trong nhà",
            ConditionCode = "Indoor"
        },
        new CourseClassCondition()
        {
            ConditionName = "Thực hành máy tính",
            ConditionCode = "LabComputer"
        },
        
    };
    private readonly List<Room> _rooms =
    [
        new Room()
        {
            
        }
    ];
    
}