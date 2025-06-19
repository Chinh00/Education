import {FieldTimeOutlined} from "@ant-design/icons";
import {Button, Drawer, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {Room} from "@/domain/room.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {ScheduleItem} from "@/domain/schedule_item.ts";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {Card} from "@/app/components/ui/card.tsx";
import {getOverlappingPairs} from "@/app/modules/education/components/overlapUtils.ts";

export type Room_timelineProps = {
    room: Room
}
const Room_timeline = ({room}: Room_timelineProps) => {
    const [open, setOpen] = useState(false)
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common)
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
    const [selectedStage, setSelectedStage] = useState(0)
    const queryStage =  selectedStage === 0 || selectedStage === 2 ? [
        {
            field: "CourseClassCode",
            operator: "Contains",
            value: "GD1"
        },
    ]  : selectedStage === 1 || selectedStage === 3 ? [
        {
            field: "CourseClassCode",
            operator: "Contains",
            value: "GD2"
        },
    ] : []

    const {data: timelines} = useGetTimeline({
        Filters: [
            {
                field: "RoomCode",
                operator: "==",
                value: room?.code
            },
            {
                field: "CourseClassCode",
                operator: "Contains",
                value: currentParentSemester?.semesterCode!
            },
            ...queryStage
        ]
    }, open)
    useEffect(() => {
        if (timelines?.data?.data?.items) {
            // Generate ScheduleItem blocks (Chú ý dayIndex và slot phải đúng)
            const items: ScheduleItem[] = timelines.data.data.items.map((item: SlotTimeline) => ({
                id: item.id,
                title: item?.courseClassCode || "Chưa có tên",
                subject: "",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                startSlot: +item?.slots[0],
                endSlot: +item?.slots[item?.slots.length - 1],
                dayIndex: item.dayOfWeek, // Nếu API trả về dayOfWeek = 2 là thứ 2, không cần -2
                duration: item?.slots?.length,
                roomCode: item.roomCode
            }));
            setScheduledItems(items);
        }
    }, [timelines]);

    // Render block giống Timeline
    return (
        <div className={"px-5"}>
            <Tooltip title={<span>Thời gian sử dụng phòng ${room?.name}</span>}>
                <Button size={"small"} onClick={() => setOpen(true)} icon={<FieldTimeOutlined size={18} />} variant={"link"} color={"blue"} />
            </Tooltip>
            <Drawer open={open} onClose={() => setOpen(false)} title={"Thời gian sử dụng phòng"} width={"100%"} >
                <Card className={"w-full p-0"}>
                    <div className="grid grid-cols-8 gap-0 select-none col-span-8">
                        {/* Header */}
                        <div className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[12px]">Tiết học</div>
                        {daysOfWeek.map((day) => (
                            <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[12px]">
                                {day}
                            </div>
                        ))}

                        {/* Time slots */}
                        {timeSlots.map((slot, slotIndex) => (
                            <div key={slot.id} className="contents">
                                <div className="border-b border-r bg-gray-50">
                                    <div className="p-[15px] text-[12px] font-medium">{slot.period}</div>
                                </div>
                                {daysOfWeek.map((day, dayIndex) => {
                                    const items = scheduledItems.filter(
                                        item => item.dayIndex === dayIndex && item.startSlot === slotIndex
                                    );
                                    const itemsOfDay = scheduledItems.filter(i => i.dayIndex === dayIndex);
                                    // overlap logic giống Timeline
                                    return (
                                        <div
                                            key={`${dayIndex}-${slotIndex}`}
                                            className={`
                                              p-1 border-b border-r relative min-h-[48px] transition-all duration-200
                                              hover:bg-gray-50 cursor-pointer
                                            `}
                                            style={{ position: "relative" }}
                                        >
                                            {items.map((item) => {
                                                // Overlap logic giống Timeline
                                                const overlaps = itemsOfDay.filter(
                                                    i => !(i.endSlot < item.startSlot || i.startSlot > item.endSlot)
                                                ).sort((a, b) => a.startSlot - b.startSlot || a.id.localeCompare(b.id));
                                                const overlapIndex = overlaps.findIndex(i => i.id === item.id);
                                                const overlapOffset = 20;
                                                const width = `calc(100% - ${overlapOffset * (overlaps.length - 1)}px)`;
                                                const left = `${overlapIndex * overlapOffset}px`;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            height: `${(item.endSlot - item.startSlot + 1) * 48}px`,
                                                            width,
                                                            left,
                                                            zIndex: 10 + overlapIndex,
                                                            top: 0,
                                                            position: 'absolute',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                                                            background: '#42a5f5',
                                                            color: '#fff',
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 4,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                                                        <div style={{ fontSize: 12 }}>{/* Thời gian, lớp... */}</div>
                                                        <span style={{
                                                            opacity: 0.85,
                                                            color: '#fff',
                                                            fontWeight: 400,
                                                            pointerEvents: 'none',
                                                            whiteSpace: 'nowrap',
                                                            fontSize: 10
                                                        }}>
                                                            {item?.roomCode ? `Phòng: ${item?.roomCode}` : ""}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </Card>
            </Drawer>
        </div>
    );
}
export default Room_timeline;