import { daysOfWeek, timeSlots } from "@/app/modules/student/pages/student_timeline.tsx";
import { Fragment } from "react";
import type { SlotTimeline } from "@/domain/slot_timeline";


const TimelineTable = () => {
    // Helper to find slot info for a cell
    const getSlot = (dayIndex: number, slotId: string) =>
        [
            {dayOfWeek: 0, slots: ["slot1", "slot2"], courseClassCode: "CS101", buildingCode: "B1", roomCode: "R101", id: "1", createdAt: "2023-10-01T00:00:00Z"},
        ].find(
            s => s.dayOfWeek === dayIndex && s.slots.includes(slotId)
        );

    return (
        <div className="w-full h-full overflow-x-auto">
            <div className="grid grid-cols-8 gap-0 w-full h-full">
                {/* Header row */}
                <div className="bg-gray-50 p-3 border-b border-r font-medium text-center">Tiết học</div>
                {daysOfWeek.map((day) => (
                    <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center">
                        {day}
                    </div>
                ))}

                {/* Time slots rows */}
                {timeSlots.map((slot, slotIndex) => (
                    <Fragment key={slot.id}>
                        <div className="p-3 border-b border-r bg-gray-50">
                            <div className="text-sm font-medium">{slot.period}</div>
                            <div className="text-xs text-gray-500">{slot.time}</div>
                        </div>
                        {daysOfWeek.map((_, dayIndex) => {
                            const slotInfo = getSlot(dayIndex, slot.id);
                            return (
                                <div
                                    key={dayIndex}
                                    className="p-2 border-b border-r min-h-[60px] transition-colors relative bg-white"
                                >
                                    {slotInfo && (
                                        <div>
                                            <div className="font-semibold">{slotInfo.courseClassCode}</div>
                                            <div className="text-xs">{slotInfo.buildingCode} - {slotInfo.roomCode}</div>
                                            <div className="text-xs text-gray-500">
                                                {/* Optionally show thêm thông tin */}
                                                ID: {slotInfo.id}<br/>
                                                Ngày: {slotInfo.createdAt && new Date(slotInfo.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default TimelineTable;