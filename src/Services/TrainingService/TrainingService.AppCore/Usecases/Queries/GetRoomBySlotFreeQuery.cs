using Education.Core.Domain;
using Education.Core.Repository;
using MediatR;
using MongoDB.Driver;
using TrainingService.AppCore.Usecases.Specs;
using TrainingService.Domain;

namespace TrainingService.AppCore.Usecases.Queries;

public record GetRoomBySlotFreeQuery(string KeySearch, string SemesterCode, List<int> Stages, int DayOfWeek, int StartPeriod, int SessionLength, List<string> Conditions) : IQuery<ListResultModel<Room>>
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
            var courseClasses = await courseClassRepository.FindAsync(
                new GetCourseClassBySemesterCodeAndListStageSpec(request.SemesterCode, request.Stages), cancellationToken);
            var slotTimelines = await slotTimelineRepository.FindAsync(
                new GetSlotTimelineByListCodeSpec(courseClasses.Select(c => c.CourseClassCode).ToList()),
                cancellationToken);
            var periodsPerDay = 12;
            var roomBusy = new Dictionary<string, HashSet<(int day, int period)>>();

            foreach (var room in rooms)
            {
                roomBusy[room.Code] = new HashSet<(int, int)>();
            }
            foreach (var slot in slotTimelines)
            {
                if (roomBusy.ContainsKey(slot.RoomCode))
                {
                    var day = slot.DayOfWeek;
                    foreach (var slotStr in slot.Slots)
                    {
                        if (int.TryParse(slotStr, out var period))
                        {
                            roomBusy[slot.RoomCode].Add((day, period));
                        }
                    }
                }
            }

            var availableRooms = new List<Room>();
            foreach (var room in rooms)
            {
                var day = request.DayOfWeek;
                var startPeriod = request.StartPeriod;

                // Check if startPeriod is valid
                if (startPeriod < 0 || startPeriod > periodsPerDay - request.SessionLength) continue;

                var isFree = true;
                for (var p = 0; p < request.SessionLength; p++)
                {
                    if (roomBusy[room.Code].Contains((day, startPeriod + p)))
                    {
                        isFree = false;
                        break;
                    }
                }
                if (isFree)
                {
                    availableRooms.Add(room);
                }
            }

            return ResultModel<ListResultModel<Room>>.Create(ListResultModel<Room>.Create(availableRooms, availableRooms.Count, 1, 10));
        }
    }
}