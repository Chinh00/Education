
using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record ConfigSemesterForClassCommand(string SemesterCode, List<string> ClassCodes) : ICommand<IResult>
{
    public readonly record struct NotFoundSemester(string Message);
    public readonly record struct NotFoundClass(string Message);
    internal class Handler : IRequestHandler<ConfigSemesterForClassCommand, IResult>
    {
        private readonly IMongoRepository<ClassManager> _mongoRepositoryClass;
        private readonly IMongoRepository<Semester> _mongoRepositorySemester;
        public Handler(IMongoRepository<ClassManager> mongoRepositoryClass, IMongoRepository<Semester> mongoRepositorySemester)
        {
            _mongoRepositoryClass = mongoRepositoryClass;
            _mongoRepositorySemester = mongoRepositorySemester;
        }

        public async Task<IResult> Handle(ConfigSemesterForClassCommand request, CancellationToken cancellationToken)
        {
            var (semesterCode, classCodes) = request;
            var semesterSpec = new GetSemesterByCodeSpec(semesterCode);
            var semester = await _mongoRepositorySemester.FindOneAsync(semesterSpec, cancellationToken);
            if (semester is null)
                return Results.NotFound(
                    ResultModel<NotFoundSemester>.Create(new NotFoundSemester("Không tìm thấy thông tin kì học")));
            var listClass = new List<ClassManager>();
            if (listClass == null) throw new ArgumentNullException(nameof(listClass));
            foreach (var classSpec in classCodes.Select(classCode => new GetClassManagerByClassCodeSpec(classCode)))
            {
                var classManager = await _mongoRepositoryClass.FindOneAsync(classSpec, cancellationToken);
                if (classManager is null)
                    return Results.NotFound(
                        ResultModel<NotFoundClass>.Create(new NotFoundClass("Không tìm thấy thông tin lớp học")));
                listClass.Add(classManager);
            }
            foreach (var classManager in listClass)
            {
                if (classManager.SemesterClasses.All(c => c.SemesterCode != semester.SemesterCode))
                    classManager.SemesterClasses.Add(new SemesterClass()
                    {
                        SemesterId = semester.Id,
                        SemesterCode = semester.SemesterCode,
                    });
            }
            foreach (var classManager in listClass)
            {
                var spec = new GetClassManagerByClassCodeSpec(classManager.ClassCode);
                await _mongoRepositoryClass.UpsertOneAsync(spec, classManager, cancellationToken);
            }
            return Results.Ok();
        }
    }
}