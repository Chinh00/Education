using Education.Contract.IntegrationEvents;
using Education.Core.Domain;
using Education.Core.Repository;
using MassTransit;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record StudentChangeCourseClassCommand(string SemesterCode, string StudentCode, string OriginalCourseClassCode, string TargetCourseClassCode) 
    : ICommand<IResult>
{
    internal class Handler(
        ITopicProducer<StudentEvictedIntegrationEvent> studentEvictedProducer,
        ITopicProducer<CourseClassAddedStudentIntegrationEvent> courseClassAddedStudentProducer,
        IMongoRepository<CourseClass> courseClassRepository)
        : IRequestHandler<StudentChangeCourseClassCommand, IResult>
    {
        public async Task<IResult> Handle(StudentChangeCourseClassCommand request, CancellationToken cancellationToken)
        {
            var originCourseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.OriginalCourseClassCode), cancellationToken);
            var targetCourseClass = await courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.TargetCourseClassCode), cancellationToken);
            if (originCourseClass == null || targetCourseClass == null)
            {
                return Results.BadRequest("Lớp học không tồn tại");
            }
            if (originCourseClass.SubjectCode != targetCourseClass.SubjectCode)
            {
                return Results.BadRequest("Không thể chuyển lớp học khác môn");
            }
            originCourseClass.StudentIds.Remove(request.StudentCode);
            targetCourseClass.StudentIds.Add(request.StudentCode);
            await courseClassRepository.UpsertOneAsync(new GetCourseClassByCodeSpec(request.OriginalCourseClassCode), originCourseClass, cancellationToken);
            await courseClassRepository.UpsertOneAsync(new GetCourseClassByCodeSpec(request.TargetCourseClassCode), targetCourseClass, cancellationToken);
            await studentEvictedProducer.Produce(new StudentEvictedIntegrationEvent(request.SemesterCode, request.StudentCode, request.OriginalCourseClassCode), cancellationToken);
            await courseClassAddedStudentProducer.Produce(new CourseClassAddedStudentIntegrationEvent(request.SemesterCode, request.StudentCode, request.TargetCourseClassCode), cancellationToken);
            return Results.Ok();
        }
    }
    
}