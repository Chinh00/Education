import {FieldTimeOutlined} from "@ant-design/icons";
import {Button, Drawer, Dropdown, Select, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {Room} from "@/domain/room.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {ScheduleItem} from "@/domain/schedule_item.ts";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {useRemoveCourseClassSlotTimeline} from "@/app/modules/education/hooks/useRemoveCourseClassSlotTimeline.ts";
import {useAddCourseClassSlotTimeline} from "@/app/modules/education/hooks/useAddCourseClassSlotTimeline.ts";
import toast from "react-hot-toast";
import {SearchRoomFreeQueryModel} from "@/app/modules/education/services/courseClass.service.ts";
import {useGetRoomFreeSlots} from "@/app/modules/education/hooks/useGetRoomFreeSlots.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {Card} from "@/app/components/ui/card.tsx";
import {getOverlappingPairs} from "@/app/modules/education/components/overlapUtils.ts";
import {Box, IconButton} from "@mui/material";
import {CircleCheck, Plus, Trash2} from "lucide-react";

export type Room_timelineProps = {
    room: Room
}
const Room_timeline = ({room}: Room_timelineProps) => {
    const [open, setOpen] = useState(false)
    const [selectedStage, setSelectedStage] = useState(0)
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common)
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
            {
                field: "CourseClassCode",
                operator: "Contains",
                value: "GD1"
            },
        ]
    }, open)
    useEffect(() => {
        if (timelines?.data?.data?.items) {
            const items: ScheduleItem[] = timelines.data.data.items.map((item: SlotTimeline, index) => ({
                id: item.id,
                title: item?.courseClassCode || "Chưa có tên",
                subject: "",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                startSlot: +item?.slots[0],
                endSlot: +item?.slots[item?.slots.length - 1],
                dayIndex: item.dayOfWeek,
                duration: item?.slots?.length,
                roomCode: item.roomCode
            }));
            setScheduledItems(prevState => [...prevState, ...items]);
        }
    }, [timelines]);
    
    
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);









   

    

   
   

  

    

  
   


    return (
        <div className={"px-5"}>
            <Tooltip title={"Thời gian sử dụng phòng"}>
                <Button size={"small"} onClick={() => setOpen(true)} icon={<FieldTimeOutlined size={18} />} variant={"link"} color={"blue"} />
            </Tooltip>
            <Drawer open={open} onClose={() => setOpen(false)} title={"Thời gian sử dụng phòng"} width={"100%"} >
                <Card className={"w-full p-0"}>
                    <div
                        className="grid grid-cols-8 gap-0 select-none col-span-8"
                        
                    >
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
                                    const overlapPairs = getOverlappingPairs(itemsOfDay);

                                    return (
                                        <div
                                            key={`${dayIndex}-${slotIndex}`}
                                            className={`
                                              p-1 border-b border-r relative min-h-[48px]
                                              transition-all duration-200
                                              ${"bg-blue-200 border-blue-400"}
                                              ${"bg-green-200 border-green-400 border-2 border-dashed"}
                                              ${false ? "hover:bg-gray-50 cursor-pointer" : ""}
                                            `}
                                            style={{ position: "relative" }}
                                            
                                        >
                                            {/* Render all items that start at this slot */}
                                            {items.map((item) => {
                                                // Find all overlapping blocks with this item
                                                const overlaps = itemsOfDay.filter(
                                                    i => !(i.endSlot < item.startSlot || i.startSlot > item.endSlot)
                                                ).sort((a, b) => a.startSlot - b.startSlot || a.id.localeCompare(b.id));
                                                const overlapIndex = overlaps.findIndex(i => i.id === item.id);
                                                // Ensure block does not overflow out of cell
                                                const overlapOffset = 20;
                                                const width = `calc(100% - ${overlapOffset * (overlaps.length - 1)}px)`;
                                                const left = `${overlapIndex * overlapOffset}px`;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        draggable={false}
                                                        onMouseDown={e => e.stopPropagation()}
                                                        style={{
                                                            height: `${(item.endSlot - item.startSlot + 1) * 48}px`,
                                                            width,
                                                            left,
                                                            zIndex: 10 + overlapIndex,
                                                            top: 0,
                                                            pointerEvents: isDragging && draggedItem?.id !== item.id ? 'none' : 'auto',
                                                            position: 'absolute',
                                                            // border: '1.5px solid #1976d2',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                                                            background: '#42a5f5',
                                                            color: '#222',
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 4,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                                                        <div style={{ fontSize: 12 }}>{/* Thời gian, phòng ... */}</div>
                                                        
                                                        <span style={{
                                                            opacity: 0.75,
                                                            color: !item?.roomCode ? '#ff5252' : '#222',
                                                            fontWeight: !item?.roomCode ? 700 : 400,
                                                            pointerEvents: 'none',
                                                            whiteSpace: 'nowrap',
                                                            fontSize: 10
                                                        }}>
                                                        {item?.roomCode ? `Phòng: ${item?.roomCode}` : "Chưa chọn"}
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

export default Room_timeline