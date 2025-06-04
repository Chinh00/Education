using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Services;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.EventStore;
using MediatR;
using MongoDB.Bson;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Commands;

public record UpdateCourseTeacherCommand(UpdateCourseTeacherCommand.UpdateCourseTeacherModel Model) : ICommand<IResult>
{
    public record struct UpdateCourseTeacherModel(string CourseClassCode, string TeacherCode);
    internal class Handler(
        IMongoRepository<Staff> staffRepository,
        IClaimContextAccessor claimContextAccessor,
        IMongoRepository<CourseClass> courseClassRepository)
        : IRequestHandler<UpdateCourseTeacherCommand, IResult>
    {
        public async Task<IResult> Handle(UpdateCourseTeacherCommand request, CancellationToken cancellationToken)
        {
            var (userId, userName) = (claimContextAccessor.GetUserId(), claimContextAccessor.GetUsername());
            
            var spec = new GetStaffByCodeSpec(request.Model.TeacherCode);
            var teacher = await staffRepository.FindOneAsync(spec, cancellationToken);
            
            var courseClass = await 
                courseClassRepository.FindOneAsync(new GetCourseClassByCodeSpec(request.Model.CourseClassCode),
                    cancellationToken);
            courseClass.TeacherCode = request.Model.TeacherCode;
            courseClass.TeacherName = teacher.FullName;
            
            return Results.Ok();
        }
    }
}