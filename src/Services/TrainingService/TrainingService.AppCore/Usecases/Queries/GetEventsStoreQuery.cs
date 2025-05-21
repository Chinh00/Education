using Education.Core.Domain;
using Education.Core.Repository;
using Education.Core.Utils;
using MediatR;
using Newtonsoft.Json;
using TrainingService.AppCore.Usecases.Specs;

namespace TrainingService.AppCore.Usecases.Queries;


public class EventStoreDto
{
    public string PerformedByName { get; set; }
    public DateTime CreatedAt { get; set; }
    public string EventName { get; set; }
    public List<ChangeDetail> ChangeDetails { get; set; }
}

public class GetEventsStoreQuery : IListQuery<ListResultModel<EventStoreDto>>
{
    public List<FilterModel> Filters { get; set; } = [];
    public List<string> Sorts { get; set; } = [];
    public List<string> Includes { get; set; } = [];
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    internal class Handler(IMongoRepository<EventStore> eventStoreRepository)
        : IRequestHandler<GetEventsStoreQuery, ResultModel<ListResultModel<EventStoreDto>>>
    {
        public async Task<ResultModel<ListResultModel<EventStoreDto>>> Handle(GetEventsStoreQuery request, CancellationToken cancellationToken)
        {
            var spec = new GetEventsStoreSpec(request);
            var items = await eventStoreRepository.FindAsync(spec, cancellationToken);
            var totalItems = await eventStoreRepository.CountAsync(spec, cancellationToken);
            var eventStoreDtos = new List<EventStoreDto>();
            for (int i = 0; i < items.Count; i++)
            {
                var eventType = Type.GetType(items[i].EventType);
                var descriptionFromType = AttributeUtils.GetDescriptionFromType(eventType);
                var changeDetails = CompareObject.GetDifferencesWithCompareNetObjects(
                    JsonConvert.DeserializeObject(items[i]?.EventData, eventType),
                    JsonConvert.DeserializeObject(items[i + 1 < items.Count ? i + 1 : i]?.EventData, eventType));
                eventStoreDtos.Add(new EventStoreDto()
                {
                    EventName = descriptionFromType,
                    ChangeDetails = changeDetails,
                    PerformedByName = items[i]?.Metadata["PerformedByName"]?.ToString(),
                    CreatedAt = items[i].CreatedAt,
                });
            }
            return ResultModel<ListResultModel<EventStoreDto>>.Create(
                ListResultModel<EventStoreDto>.Create(eventStoreDtos, totalItems, request.Page, request.PageSize));
        }
    }
}