using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public class GetSubjectTimelineConfigQuery : IItemQuery<string, SubjectTimelineConfig>
{
    public string Id { get; set; }
    
    internal class Handler(IMongoRepository<SubjectTimelineConfig> repository)
        : IRequestHandler<GetSubjectTimelineConfigQuery, ResultModel<SubjectTimelineConfig>>
    {
        public async Task<ResultModel<SubjectTimelineConfig>> Handle(GetSubjectTimelineConfigQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetSubjectTimelineBySubjectCodeSpec(request.Id);
            var subject = await repository.FindOneAsync(spec, cancellationToken);
            return ResultModel<SubjectTimelineConfig>.Create(subject);
        }
    }
}