using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using MongoDB.Driver;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetRoomBySlotFreeQuery(string KeySearch, string SemesterCode, int Stage, int DayOfWeek, int StartPeriod, int SessionLength, List<string> Conditions)
    : IQuery<ListResultModel<Room>>
{
    internal class Handler(
        IMongoRepository<Room> roomRepository,
        IMongoRepository<CourseClass> courseClassRepository,
        IMongoRepository<SlotTimeline> slotTimelineRepository)
        : IRequestHandler<GetRoomBySlotFreeQuery, ResultModel<ListResultModel<Room>>>
    {
        public async Task<ResultModel<ListResultModel<Room>>> Handle(GetRoomBySlotFreeQuery request, CancellationToken cancellationToken)
        {
            var rooms = await roomRepository.FindAsync(new GetRoomsByConditionsSpec(request.KeySearch, request.Conditions ?? []), cancellationToken);

            var slotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineFreeByRoomSpec(request.SemesterCode, (SubjectTimelineStage)request.Stage),
                cancellationToken);

            var requestedDay = request.DayOfWeek;
            var requestedSlots = Enumerable.Range(request.StartPeriod, request.SessionLength)
                                           .Select(x => x.ToString())
                                           .ToHashSet();

            var freeRooms = new List<Room>();

            foreach (var room in rooms)
            {
                var busyTimelines = slotTimelines.Where(x =>
                    x.RoomCode == room.Code &&
                    x.DayOfWeek == requestedDay
                );

                if (!busyTimelines.Any())
                {
                    freeRooms.Add(room);
                    continue;
                }

                
                bool isBusy = busyTimelines.Any(tl =>
                    tl.Slots.Any(slot => requestedSlots.Contains(slot))
                );

                if (!isBusy)
                    freeRooms.Add(room);
            }

            // 4. Paging (nếu cần có thể bổ sung, hiện tại trả tất cả)
            var result = ListResultModel<Room>.Create(freeRooms, 1, freeRooms.Count, freeRooms.Count);

            return ResultModel<ListResultModel<Room>>.Create(result);
        }
    }
}