using Education.Core.Domain;
using Education.Core.Specification;
using TrainingService.AppCore.Usecases.Queries;

namespace TrainingService.AppCore.Usecases.Specs;

public class GetEventsStoreSpec : ListSpecificationBase<EventStore>
{
    public GetEventsStoreSpec(IListQuery<ListResultModel<EventStoreDto>> query)
    {
        ApplyFilters(query.Filters);
        ApplyPaging(query.Page, query.PageSize);
        ApplyIncludes(query.Includes);
        ApplySorts(query.Sorts);
        ApplyInclude(c => c.Id);
        ApplyInclude(c => c.AggregateType);
        ApplyInclude(c => c.AggregateId);
        ApplyInclude(c => c.EventType);
        ApplyInclude(c => c.EventData);
        ApplyInclude(c => c.Metadata);
        ApplyInclude(c => c.CreatedAt);
    }
}