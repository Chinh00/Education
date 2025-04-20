using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record CreateWishRegisterCommand(string EducationCode, string SemesterCode, List<string> SubjectCodes) : ICommand<IResult>
{

    public readonly record struct NotFoundEducation(string Message);
    public readonly record struct NotFoundSemester(string Message);
    
    internal class Handler(
        IMongoRepository<ClassManager> mongoRepository,
        IMongoRepository<EducationProgram> educationProgramRepository,
        ITopicProducer<RegisterSemesterCreatedIntegrationEvent> topicProducer)
        : IRequestHandler<CreateWishRegisterCommand, IResult>
    {

        public async Task<IResult> Handle(CreateWishRegisterCommand request, CancellationToken cancellationToken)
        {
            var (educationCode, semesterCode, subjectCodes) = request;
            var educationSpec = new GetEducationByCodeSpec(educationCode);
            var education = await educationProgramRepository.FindOneAsync(educationSpec, cancellationToken);
            if (education is null)
                return Results.NotFound(
                    ResultModel<NotFoundEducation>.Create(
                        new NotFoundEducation("Không tìm thấy thông tin chương trình đào tạo")));
            if (subjectCodes.Except(education.EducationSubjects.Select(c => c.Subject.SubjectCode)).ToList().Count !=
                subjectCodes.Count)
            {
                return Results.BadRequest(
                    ResultModel<NotFoundEducation>.Create(
                        new NotFoundEducation("Môn học không nằm trong chương trình đào tạo")));
            }
            
            var classesSpec = new GetClassManagerByEducationCodeSpec(educationCode);
            var classes = await mongoRepository.FindAsync(classesSpec, cancellationToken);
            foreach (var @class in classes)
            {
                var subjectExits = new List<string>();
                if (subjectExits == null) throw new ArgumentNullException(nameof(subjectExits));
                foreach (var classSemesterClass in @class.SemesterClasses)
                {
                    subjectExits.AddRange(classSemesterClass.SubjectCodes);
                }


                var semesters = @class.SemesterClasses.FirstOrDefault(c => c.SemesterCode == semesterCode);
                foreach (var subjectCode in subjectCodes)
                {
                    semesters?.SubjectCodes.Add(subjectCode);
                }
                await mongoRepository.UpsertOneAsync(classesSpec, @class, cancellationToken);
                
            }

            await topicProducer.Produce(new RegisterSemesterCreatedIntegrationEvent()
            {
                CourseName = education.CourseCode,
                CourseCode = education.CourseCode,
                SemesterCode = semesterCode,
                SemesterName = semesterCode,
                EducationCode = educationCode,
                Subjects = subjectCodes.Select(c => new RegisterSubject(c,
                    education?.EducationSubjects?.FirstOrDefault(e => e.Subject.SubjectCode == c)?.Subject
                        ?.SubjectName)).ToList()
            }, cancellationToken);
            return Results.Created();
        }
    }
}