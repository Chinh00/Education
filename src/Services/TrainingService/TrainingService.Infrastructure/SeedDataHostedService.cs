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
        var roomRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Room>>();
        foreach (var courseClassCondition in _courseClassConditions)
        {
            var spec = new GetCourseClassConditionByCodeSpec(courseClassCondition.ConditionCode);
            var condition = await repository.FindOneAsync(spec, cancellationToken);
            if (condition == null)
            {
                await repository.AddAsync(courseClassCondition, cancellationToken);
            }
        }
        foreach (var room in _rooms)
        {
            var spec = new GetRoomByCodeSpec(room.Code);
            var condition = await roomRepository.FindOneAsync(spec, cancellationToken);
            if (condition == null)
            {
                await roomRepository.AddAsync(room, cancellationToken);
            }
        }
        
        
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    private readonly List<CourseClassCondition> _courseClassConditions =
    [
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
        }


    ];
    private readonly List<Room> _rooms =
        [
            // Phòng lý thuyết
            new Room
            {
                Capacity = 40,
                Code = "R001",
                Name = "Phòng học lý thuyết A1",
                BuildingCode = "B1",
                SupportedConditions = ["Indoor"]
            },
            new Room
            {
                Capacity = 35,
                Code = "R002",
                Name = "Phòng học lý thuyết A2",
                BuildingCode = "B1",
                SupportedConditions = ["Indoor"]
            },

            // Phòng ngoài trời
            new Room
            {
                Capacity = 50,
                Code = "R003",
                Name = "Sân thể chất 1",
                BuildingCode = "S1",
                SupportedConditions = ["Outdoor"]
            },
            new Room
            {
                Capacity = 60,
                Code = "R004",
                Name = "Khu sinh hoạt ngoài trời",
                BuildingCode = "S2",
                SupportedConditions = ["Outdoor"]
            },

            // Phòng thực hành máy tính
            new Room
            {
                Capacity = 25,
                Code = "R005",
                Name = "Phòng máy tính 101",
                BuildingCode = "C1",
                SupportedConditions = ["LabComputer"]
            },
            new Room
            {
                Capacity = 30,
                Code = "R006",
                Name = "Phòng máy tính 102",
                BuildingCode = "C1",
                SupportedConditions = ["LabComputer"]
            },
            new Room
            {
                Capacity = 20,
                Code = "R007",
                Name = "Phòng máy tính 103",
                BuildingCode = "C2",
                SupportedConditions = ["LabComputer"]
            },

            // Phòng ngoài trời (bổ sung)
            new Room
            {
                Capacity = 45,
                Code = "R008",
                Name = "Sân khấu ngoài trời",
                BuildingCode = "S3",
                SupportedConditions = ["Outdoor"]
            },

            // Phòng kết hợp (Indoor + Lab)
            new Room
            {
                Capacity = 28,
                Code = "R009",
                Name = "Phòng học đa năng 1",
                BuildingCode = "D1",
                SupportedConditions = ["Indoor", "LabComputer"]
            },

            // Phòng kết hợp (Outdoor + Lab)
            new Room
            {
                Capacity = 22,
                Code = "R010",
                Name = "Phòng học thực địa",
                BuildingCode = "E1",
                SupportedConditions = ["Outdoor", "LabComputer"]
            }
        ];

    
}