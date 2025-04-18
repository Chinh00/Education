using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateWishRegisterCommand(string EducationCode, string SemesterCode, List<string> SubjectCodes) : ICommand<IResult>
{

    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler : IRequestHandler<CreateWishRegisterCommand, IResult>
    {
        private readonly IMongoRepository<ClassManager> _mongoRepository;
        private readonly IMongoRepository<EducationProgram> _educationProgramRepository;
        public Handler(IMongoRepository<ClassManager> mongoRepository, IMongoRepository<EducationProgram> educationProgramRepository)
        {
            _mongoRepository = mongoRepository;
            _educationProgramRepository = educationProgramRepository;
        }

        public async Task<IResult> Handle(CreateWishRegisterCommand request, CancellationToken cancellationToken)
        {
            var spec = new GetClassManagerByEducationCodeSpec(request.EducationCode);
            var educationSpec = new GetEducationByCodeSpec(request.EducationCode);
            var education = await _educationProgramRepository.FindOneAsync(educationSpec, cancellationToken);
            if (education is null) return Results.NotFound(
                ResultModel<NotFoundEducation>.Create(new NotFoundEducation("Không tìm thấy thông tin chương trình đào tạo")));
            
            
            
            var classes = await _mongoRepository.FindAsync(spec, cancellationToken);
            foreach (var classManager in classes)
            {
                var semesterClasses = classManager.SemesterClasses.ToList().FirstOrDefault(c => c.SemesterCode == request.SemesterCode);
                if (semesterClasses is null)
                    return Results.NotFound(
                        ResultModel<NotFoundSemester>.Create(new NotFoundSemester("Không tìm thấy thông tin kì học")));
                List<string> subjectCodesExit = [];
                if (subjectCodesExit == null) throw new ArgumentNullException(nameof(subjectCodesExit));
                foreach (var classManagerSemesterClass in classManager.SemesterClasses)
                {
                    subjectCodesExit.AddRange(classManagerSemesterClass.SubjectCodes);
                }
                semesterClasses.SubjectCodes.ToList().AddRange(education.EducationSubjects
                    .Where(c => subjectCodesExit.Contains(c.Subject.SubjectCode)).ToList()
                    .Select(c => c.Subject.SubjectCode));
                await _mongoRepository.UpsertOneAsync(spec, classManager, cancellationToken);
            }
            return Results.Ok();
        }
    }
}