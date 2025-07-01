using Education.Core.Repository;
using Grpc.Core;
using GrpcServices;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.Infrastructure.GrpcService.Implements;
public class TrainingGrpcService(
    ISender sender,
    IMongoRepository<Subject> repository,
    IMongoRepository<EducationProgram> educationProgramRepository) : GrpcServices.Training.TrainingBase
{
    public override async Task<GetSubjectCodeResponse> getSubjectByCode(GetSubjectByCodeRequest request, ServerCallContext context)
    {
        var educationProgram = await educationProgramRepository.FindOneAsync(new GetEducationProgramByEducationCodeSpec(request.EducationCode));
        if (educationProgram is null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, "Education program not found"));
        }
        var subject = await repository.FindOneAsync(new GetSubjectBySubjectCodeSpec(request.SubjectCode));
        if (subject is null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, "Subject not found"));
        }

        return new GetSubjectCodeResponse()
        {
            SubjectCode = subject.SubjectCode,
            SubjectName = subject.SubjectName,
        };
        
        await base.getSubjectByCode(request, context);
    }
}