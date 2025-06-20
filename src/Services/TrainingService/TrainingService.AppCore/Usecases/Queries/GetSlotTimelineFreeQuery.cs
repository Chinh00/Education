using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;
using TrainingService.Domain.Enums;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetSlotTimelineFreeQuery(string SemesterCode, int Stage, int SessionLength, List<string> Conditions) : IQuery<ListResultModel<SlotTimeline>>
{
    internal class Handler : IRequestHandler<GetSlotTimelineFreeQuery, ResultModel<ListResultModel<SlotTimeline>>>
    {
        private readonly IMongoRepository<Room> _roomRepository;
        private readonly IMongoRepository<SlotTimeline> _slotTimelineRepository;
        public Handler(IMongoRepository<Room> roomRepository, IMongoRepository<SlotTimeline> slotTimelineRepository)
        {
            _roomRepository = roomRepository;
            _slotTimelineRepository = slotTimelineRepository;
        }

        public async Task<ResultModel<ListResultModel<SlotTimeline>>> Handle(GetSlotTimelineFreeQuery request, CancellationToken cancellationToken)
{
    var rooms = await _roomRepository.FindAsync(new GetRoomsByConditionsSpec("", request.Conditions ?? []), cancellationToken);
    var slotTimelines = await _slotTimelineRepository.FindAsync(
        new GetSlotTimelineFreeByRoomSpec(request.SemesterCode, (SubjectTimelineStage)request.Stage),
        cancellationToken);
    var totalDays = 6;
    var periodsPerDay = 12;
    var sessionLength = request.SessionLength;
    var result = new List<SlotTimeline>();

    var roomUsage = new Dictionary<string, bool[,]>();
    foreach (var room in rooms)
        roomUsage[room.Code] = new bool[totalDays, periodsPerDay];

    // Mark occupied slots
    foreach (var slot in slotTimelines)
    {
        if (string.IsNullOrEmpty(slot.RoomCode) || !roomUsage.ContainsKey(slot.RoomCode)) continue;
        var usage = roomUsage[slot.RoomCode];
        if (slot.Slots == null) continue;
        foreach (var slotStr in slot.Slots)
        {
            if (int.TryParse(slotStr, out var slotIdx) &&
                slot.DayOfWeek >= 0 && slot.DayOfWeek < totalDays &&
                slotIdx >= 0 && slotIdx < periodsPerDay)
            {
                usage[slot.DayOfWeek, slotIdx] = true;
            }
        }
    }

    // Lặp từng ngày, từng block
    for (int day = 0; day < totalDays; day++)
    {
        for (int blockStart = 0; blockStart <= periodsPerDay - sessionLength; blockStart += sessionLength)
        {
            bool found = false;
            // random rooms
            foreach (var room in rooms.OrderBy(r => Guid.NewGuid()).ToList())
            {
                var usage = roomUsage[room.Code];
                bool canUse = true;
                for (int i = 0; i < sessionLength; i++)
                {
                    if (usage[day, blockStart + i]) { canUse = false; break; }
                }
                if (canUse)
                {
                    // Thêm 1 phòng đầu tiên trống cho block này
                    result.Add(new SlotTimeline
                    {
                        RoomCode = room.Code,
                        DayOfWeek = day,
                        Slots = Enumerable.Range(blockStart, sessionLength).Select(x => x.ToString()).ToList()
                    });
                    found = true;
                    break; // chỉ lấy 1 phòng cho block này
                }
            }
            // Nếu không phòng nào trống, không thêm gì cho block này
        }
    }

    return ResultModel<ListResultModel<SlotTimeline>>.Create(
        new ListResultModel<SlotTimeline>(result, result.Count, result.Count, result.Count)
    );
}
    }
}