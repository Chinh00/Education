using System.Text.Json;
using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Specification;
using MassTransit;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.Infrastructure;

public class SeedDataHostedService(IServiceScopeFactory serviceScopeFactory, HttpClient httpClient) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IMongoRepository<CourseClassCondition>>();
        var roomRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Room>>();
        var educationProgramRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<EducationProgram>>();
        var subjectProgramRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Subject>>();
        var semesterProgramRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Semester>>();
        var staffRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Staff>>();
        var departmentRepository = scope.ServiceProvider.GetRequiredService<IMongoRepository<Department>>();
        var producer = scope.ServiceProvider.GetService<ITopicProducer<InitDepartmentAdminAccountIntegrationEvent>>();
        foreach (var courseClassCondition in _courseClassConditions)
        {
            var spec = new GetCourseClassConditionByCodeSpec(courseClassCondition.ConditionCode);
            var condition = await repository.FindOneAsync(spec, cancellationToken);
            if (condition == null)
            {
                await repository.AddAsync(courseClassCondition, cancellationToken);
            }
        }

        if ((await educationProgramRepository.CountAsync(new TrueListSpecification<EducationProgram>(),
                cancellationToken)) == 0)
        {
            await PullEducationPrograms(educationProgramRepository, cancellationToken);
            
        } 
        if ((await subjectProgramRepository.CountAsync(new TrueListSpecification<Subject>(),
                cancellationToken)) == 0)
        await PullSubjects(subjectProgramRepository, cancellationToken);
        if ((await semesterProgramRepository.CountAsync(new TrueListSpecification<Semester>(),
                cancellationToken)) == 0)
        await PullSemesters(semesterProgramRepository, cancellationToken);
        if ((await staffRepository.CountAsync(new TrueListSpecification<Staff>(),
                cancellationToken)) == 0)
        await PullStaffs(staffRepository, cancellationToken);
        if ((await roomRepository.CountAsync(new TrueListSpecification<Room>(),
                cancellationToken)) == 0)
            await PullRooms(roomRepository, cancellationToken);
        
        if ((await departmentRepository.CountAsync(new TrueListSpecification<Department>(),
                cancellationToken)) == 0)
        await PullDepartments(departmentRepository, producer, cancellationToken);



        await SeedSemestersAsync(semesterProgramRepository, cancellationToken);





    }
    private async Task SeedSemestersAsync(IMongoRepository<Semester> semesterRepository, CancellationToken cancellationToken)
    {
        var parentSemester = new Semester
        {
            SemesterCode = "1_2024_2025",
            SemesterName = "1_2024_2025",
            ParentSemesterCode = null,
            SemesterStatus = SemesterStatus.New,
            StartDate = new DateTime(2024, 9, 2),
            EndDate = new DateTime(2025, 1, 5)
        };

        var parentExist = await semesterRepository.FindOneAsync(
            new GetSemesterByCodeSpec(parentSemester.SemesterCode), cancellationToken);
        if (parentExist == null)
            await semesterRepository.AddAsync(parentSemester, cancellationToken);

        // Kỳ con 1
        var semester1 = new Semester
        {
            SemesterCode = "1_2024_2025_1",
            SemesterName = "1_2024_2025_1",
            StartDate = new DateTime(2024, 9, 2),
            EndDate = new DateTime(2024, 10, 27),
            ParentSemesterCode = "1_2024_2025",
            SemesterStatus = SemesterStatus.New
        };

        var exist1 = await semesterRepository.FindOneAsync(
            new GetSemesterByCodeSpec(semester1.SemesterCode), cancellationToken);
        if (exist1 == null)
            await semesterRepository.AddAsync(semester1, cancellationToken);

        // Kỳ con 2
        var semester2 = new Semester
        {
            SemesterCode = "1_2024_2025_2",
            SemesterName = "1_2024_2025_2",
            StartDate = new DateTime(2024, 11, 11),
            EndDate = new DateTime(2025, 1, 5),
            ParentSemesterCode = "1_2024_2025",
            SemesterStatus = SemesterStatus.New
        };

        var exist2 = await semesterRepository.FindOneAsync(
            new GetSemesterByCodeSpec(semester2.SemesterCode), cancellationToken);
        if (exist2 == null)
            await semesterRepository.AddAsync(semester2, cancellationToken);
    }

    async Task PullRooms(IMongoRepository<Room> roomRepository,CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/Building/Room?Page=1&PageSize=50&Includes=Code&Includes=Name&Includes=Capacity&Includes=BuildingCode&Includes=SupportedConditions";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<Room>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var room in result.Data.Items)
        {
            var spec = new GetRoomByCodeSpec(room.Code);
            var existingRoom = await roomRepository.FindOneAsync(spec, cancellation);
            if (existingRoom == null)
            {
                await roomRepository.AddAsync(room, cancellation);
            }
        }
        
    }
    async Task PullDepartments(IMongoRepository<Department> education,
        ITopicProducer<InitDepartmentAdminAccountIntegrationEvent> producer, CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/Department?Page=1&PageSize=9999&Includes=Path";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<Department>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var educationProgram in result.Data.Items)
        {
            await education.AddAsync(educationProgram, cancellation);
            if ((bool)educationProgram?.DepartmentName?.StartsWith("Bộ môn"))
            {
                await producer.Produce(new InitDepartmentAdminAccountIntegrationEvent(
                    educationProgram.DepartmentCode,
                    educationProgram.DepartmentName, educationProgram.Path), cancellation);    
            }
            
        }
    }
    
    async Task PullEducationPrograms(IMongoRepository<EducationProgram> education, CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/EducationProgram?Includes=Code&Includes=Name&Sorts=IdDesc&Includes=TrainingTime&Includes=CourseCode&Includes=SpecialityCode&Includes=EducationSubjects&Page=1&PageSize=9999";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<EducationProgram>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var educationProgram in result.Data.Items)
        {
            await education.AddAsync(educationProgram, cancellation);
        }
    }
    async Task PullSubjects(IMongoRepository<Subject> education, CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/EducationProgram/subject?Includes=SubjectName&Includes=SubjectNameEng&Includes=SubjectCode&Includes=SubjectDescription&Includes=DepartmentCode&Includes=IsCalculateMark&Includes=NumberOfCredits&Includes=Status&&Page=1&PageSize=9999";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<Subject>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var educationProgram in result.Data.Items)
        {
            await education.AddAsync(educationProgram, cancellation);
        }
    }
    async Task PullSemesters(IMongoRepository<Semester> education, CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/EducationProgram/semester?Includes=SemesterCode&Includes=SemesterName&Page=1&PageSize=99";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<Semester>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var educationProgram in result.Data.Items)
        {
            educationProgram.SemesterStatus = SemesterStatus.Finished;
            await education.AddAsync(educationProgram, cancellation);
        }
    }
    async Task PullStaffs(IMongoRepository<Staff> education, CancellationToken cancellation)
    {
        var url = $"https://dataprovider.tlu.my/api/Staff?Page=1&PageSize=2000";
        
        var response = await httpClient.GetAsync(url, cancellation);
        var json = await response.Content.ReadAsStringAsync(cancellation);
        var result = JsonSerializer.Deserialize<ResultModel<ListResultModel<Staff>>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        foreach (var educationProgram in result.Data.Items)
        {
            await education.AddAsync(educationProgram, cancellation);
        }
    }
    
    

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    private readonly List<CourseClassCondition> _courseClassConditions =
    [
        new CourseClassCondition()
        {
            ConditionName = "Lý thuyết",
            ConditionCode = "Lecture"
        },

        new CourseClassCondition()
        {
            ConditionName = "Phòng Lab",
            ConditionCode = "Lab"
        },

        new CourseClassCondition()
        {
            ConditionName = "Sân ngoài trời",
            ConditionCode = "Physical"
        },
        new CourseClassCondition()
        {
            ConditionName = "Giáo dục thể chất",
            ConditionCode = "GCTC"
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