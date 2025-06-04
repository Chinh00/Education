using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record UpdateSubjectCommand(UpdateSubjectCommand.UpdateSubjectModel Model) : ICommand<IResult>
{
    public record struct UpdateSubjectModel(
        string SubjectCode,
        int LectureTotal,
        int LectureLesson,
        int LecturePeriod,
        int LabTotal,
        int LabLesson,
        int LabPeriod,
        string[] LectureRequiredConditions,
        string[] LabRequiredConditions
        );
    
    internal class Handler(IMongoRepository<Subject> repository) : IRequestHandler<UpdateSubjectCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
        {
            var model = request.Model;
            // Implementation for updating a subject
            var spec = new GetSubjectByCodeSpec(model.SubjectCode);
            var subject = await repository.FindOneAsync(spec, cancellationToken);
            subject.LectureTotal = model.LectureTotal;
            subject.LectureLesson = model.LectureLesson;
            subject.LecturePeriod = model.LecturePeriod;
            subject.LabTotal = model.LabTotal;
            subject.LabLesson = model.LabLesson;
            subject.LabPeriod = model.LabPeriod;
            subject.LectureRequiredConditions = model.LectureRequiredConditions.ToList();
            subject.LabRequiredConditions = model.LabRequiredConditions.ToList();
            await repository.UpsertOneAsync(spec, subject, cancellationToken);
            return Results.Ok(ResultModel<string>.Create("Cập nhật môn học thành công"));
        }
    }
    
}