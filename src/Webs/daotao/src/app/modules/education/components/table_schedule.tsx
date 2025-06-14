import { Card, CardContent } from "@/app/components/ui/card.tsx";
import { daysOfWeek, timeSlots } from "@/infrastructure/date.ts";
import { CalendarRange, GripVertical, Plus, Trash2 } from "lucide-react";
import {Dropdown, Select, Spin, Table, Tooltip, Typography} from "antd";
import React, {useEffect, useState} from "react";
import { ScheduleItem } from "@/app/modules/register/pages/course_class_config.tsx";
import {ColumnsType, useGetRooms} from "@/app/modules/common/hook.ts";
import { useAppDispatch, useAppSelector } from "@/app/stores/hook.ts";
import { Box, IconButton } from "@mui/material";
import _ from "lodash";
import { Query } from "@/infrastructure/query.ts";
import { useGetTimeline } from "@/app/modules/education/hooks/useGetTimeline.ts";
import {setTimelines, SubjectStudySectionState} from "@/app/modules/education/stores/subject_study_section.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {CourseClass} from "@/domain/course_class.ts";

const TableSchedule = () => {
    const [courseClassType, setCourseClassType] = useState(0);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
    const dispatch = useAppDispatch();
    const [count, setCount] = useState(0);
    const { courseClasses, currentStageConfig, subject, timelines, courseClassesTimelines, selectedRowKeysChildren, selectedRowKeysParents } = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);


    useEffect(() => {
        
        dispatch(setTimelines({
            ...scheduledItems.reduce((acc, item) => {
                const { dayIndex, startSlot, endSlot, ...rest } = item;
                const slots = timeSlots.slice(startSlot, endSlot + 1).map((slot, index) => startSlot + index);
                // @ts-ignore
                acc[item?.id as string] = {
                    id: item.id,
                    dayOfWeek: dayIndex,
                    slots,
                    roomCode: item.roomCode,
                } as unknown as SlotTimeline
                return acc;
            }, {}),
        }))
    }, [scheduledItems]);
    
    const [query, setQuery] = useState<Query>({});
    const { data, isLoading: timeLineLoading } = useGetTimeline(query, query?.Filters?.filter(e => e.field === "RoomCode") !== undefined);
    const { data: rooms } = useGetRooms({ Page: 1, PageSize: 1000 });
    const groupRooms = _.groupBy(rooms?.data?.data?.items ?? [], "buildingCode");
    const options = Object.entries(groupRooms)?.map(([e, rooms]) => ({
        label: <span>{e}</span>,
        title: e,
        options: rooms?.map(e => ({ label: <span>{e?.name} ({e?.capacity})</span>, value: e?.code ?? "" })) ?? []
    }));

    
    const isInSelection = (dayIndex: number, slotIndex: number) => {
        if (!isSelecting || !selectionStart || !selectionEnd || isDragging) return false;
        if (dayIndex !== selectionStart.dayIndex) return false;
        const startSlot = Math.min(selectionStart.slotIndex, selectionEnd.slotIndex);
        const endSlot = Math.max(selectionStart.slotIndex, selectionEnd.slotIndex);
        return slotIndex >= startSlot && slotIndex <= endSlot;
    };

    // Utility: is this cell part of a drag preview
    const isPreviewSlot = (dayIndex: number, slotIndex: number) => {
        return (
            dragPreview &&
            dragPreview.dayIndex === dayIndex &&
            slotIndex >= dragPreview.startSlot &&
            slotIndex <= dragPreview.endSlot
        );
    };

    // Mouse events for selection
    const handleMouseDown = (dayIndex: number, slotIndex: number, e: React.MouseEvent) => {
        e.preventDefault();
        setIsSelecting(true);
        setSelectionStart({ dayIndex, slotIndex });
        setSelectionEnd({ dayIndex, slotIndex });
    };

    const handleMouseEnter = (dayIndex: number, slotIndex: number) => {
        if (isSelecting && selectionStart && !isDragging) {
            if (dayIndex === selectionStart.dayIndex) {
                setSelectionEnd({ dayIndex, slotIndex });
            }
        }
    };

    const handleMouseUp = () => {
        if (isSelecting && selectionStart && selectionEnd && !isDragging) {
            createScheduleBlock();
        }
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
    };

    const FIXED_DURATION = 3;
    const createScheduleBlock = () => {
        if (!selectionStart || !selectionEnd) return;
        const start = selectionStart.slotIndex;
        const end = selectionEnd.slotIndex;
        const dayIndex = selectionStart.dayIndex;
        const isForward = end >= start;
        const startSlot = isForward ? start : start - FIXED_DURATION + 1;
        const validStartSlot = Math.max(0, startSlot);
        const validEndSlot = validStartSlot + FIXED_DURATION - 1;
        if (validStartSlot < 0 || validEndSlot >= timeSlots.length) return;
        const selectionLength = Math.abs(end - start) + 1;
        if (selectionLength < FIXED_DURATION) return;
        const textTitle = (count) <= (subject?.lectureLesson ?? 0) - 1 ? "LC" : "LTP";
        const newItem: ScheduleItem = {
            id: `schedule-${Date.now()}-${Math.random()}`,
            title: `${textTitle}`,
            subject: courseClassType === 0 ? "Lý thuyết" : "Thực hành",
            color:
                courseClassType === 0
                    ? `${textTitle == "LC" ? "bg-blue-100" : "bg-green-100"}  text-blue-800 border-blue-200`
                    : "bg-green-100 text-green-800 border-green-200",
            startSlot: validStartSlot,
            endSlot: validEndSlot,
            dayIndex,
            duration: FIXED_DURATION,
        };
        setScheduledItems((prev) => {
            if (prev?.map(e => e.id?.includes("Parent"))?.length === (selectedRowKeysParents?.length * (subject?.lectureLesson ?? 1))) {
                return [...prev, ...selectedRowKeysChildren?.map(e => ({
                    ...newItem,
                    id: newItem.id + `-${e}`,
                } as unknown as ScheduleItem))]
            }
            return [...prev, ...selectedRowKeysParents?.map(e => ({
                ...newItem,
                id: newItem.id + `-${e}`,
            } as unknown as ScheduleItem))] 
        })
        
        
        // dispatch(setTimelines({
        //     ...timelines,
        //     [newItem.id]: {
        //         id: newItem.id,
        //         dayOfWeek: newItem?.dayIndex,
        //         slots: timeSlots.slice(newItem.startSlot, newItem.endSlot + 1).map((slot, index) => index),
        //     } as unknown as SlotTimeline
        // }))
        setCount(e => e + 1);
        setIsDragging(false);
    };

    // Drag and drop
    const handleDragStart = (e: React.DragEvent, item: ScheduleItem) => {
        setDraggedItem(item);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
        // Custom drag image
        const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
        dragImage.style.transform = "rotate(5deg)";
        dragImage.style.opacity = "0.8";
        e.dataTransfer.setDragImage(dragImage, 50, 25);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragPreview(null);
        setIsDragging(false);
    };

    const handleCellDragOver = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;
        const endSlot = Math.min(slotIndex + draggedItem.duration - 1, timeSlots.length - 1);
        setDragPreview({
            dayIndex,
            startSlot: slotIndex,
            endSlot,
        });
    };

    const handleDragLeave = () => {
        setTimeout(() => {
            if (!isDragging) {
                setDragPreview(null);
            }
        }, 50);
    };

    // Drop (allow overlap)
    const handleDrop = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;
        const duration = draggedItem.duration;
        const endSlot = slotIndex + duration - 1;
        if (endSlot >= timeSlots.length) {
            setDragPreview(null);
            setDraggedItem(null);
            setIsDragging(false);
            return;
        }
        // Allow overlap, just update the item's position
        setScheduledItems((prev) =>
            prev.map((item) =>
                item.id === draggedItem.id ? { ...item, dayIndex, startSlot: slotIndex, endSlot } : item
            )
        );
        const {[draggedItem.id]: _, ...restTimelines} = timelines;
        // dispatch(setTimelines({
        //     ...restTimelines,
        //     [draggedItem.id]: {
        //         id: draggedItem.id,
        //         dayOfWeek: dayIndex,
        //         slots: timeSlots.slice(slotIndex, endSlot + 1).map((slot, index) => index),
        //     } as unknown as SlotTimeline
        //    
        // }))
        dispatch(setTimelines({
            ...timelines,
            [draggedItem.id]: {
                id: draggedItem.id,
                dayOfWeek: dayIndex,
                slots: Array.from({ length: duration }, (_, i) => slotIndex + i),
                roomCode: draggedItem.roomCode
            } as unknown as SlotTimeline
        }));
        setDragPreview(null);
        setDraggedItem(null);
        setIsDragging(false);
    };

    // Delete block
    const handleDelete = (itemId: string) => {
        setScheduledItems(prev => prev.filter(i => i.id !== itemId));
    };


    // useEffect(() => {
    //     const courseClassTimelines = Object.entries(courseClassesTimelines)
    //     scheduledItems.map(e => {
    //         const filterTimelines = courseClassTimelines?.filter(([key, values]) => values?.includes(e?.id)) 
    //        
    //        
    //         setScheduledItems(prevState => [
    //             ...prevState?.filter(e2 => e2.id !== e.id),
    //             ...filterTimelines?.map(([key, values]) => ({
    //                 ...e,
    //                 id: e.id + `-${key}`,
    //             } as ScheduleItem))
    //            
    //         ])
    //     })
    // }, [courseClassesTimelines]);
    //
    
    return (
        <Card className={"h-fit p-0"}>
            <CardContent className="grid grid-cols-8 p-0">
                <div className={"absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                    <Spin spinning={timeLineLoading} size={"large"} />
                </div>
                <div
                    className="grid grid-cols-8 gap-0 select-none col-span-8"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Header */}
                    <div className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[13px]">Tiết học</div>
                    {daysOfWeek.map((day) => (
                        <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[12px]">
                            {day}
                        </div>
                    ))}

                    {/* Time slots */}
                    {timeSlots.map((slot, slotIndex) => (
                        <div key={slot.id} className="contents">
                            <div className="border-b border-r bg-gray-50">
                                <div className="p-[15px] text-[13px] font-medium">{slot.period}</div>
                            </div>
                            {daysOfWeek.map((day, dayIndex) => {
                                const inSelection = isInSelection(dayIndex, slotIndex);
                                const isPreview = isPreviewSlot(dayIndex, slotIndex);

                                // Get all blocks that start at this slot on this day
                                const items = scheduledItems.filter(
                                    item => item.dayIndex === dayIndex && item.startSlot === slotIndex
                                );
                                // All blocks on this day (for overlap calculation)
                                const itemsOfDay = scheduledItems.filter(i => i.dayIndex === dayIndex);

                                return (
                                    <div
                                        key={`${dayIndex}-${slotIndex}`}
                                        className={`
                      p-1 border-b border-r relative min-h-[48px]
                      transition-all duration-200
                      ${inSelection ? "bg-blue-200 border-blue-400" : ""}
                      ${isPreview ? "bg-green-200 border-green-400 border-2 border-dashed" : ""}
                      ${!inSelection && !isPreview ? "hover:bg-gray-50 cursor-pointer" : ""}
                    `}
                                        style={{ position: "relative" }}
                                        onMouseDown={(e) => handleMouseDown(dayIndex, slotIndex, e)}
                                        onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                        onDragOver={(e) => handleCellDragOver(e, dayIndex, slotIndex)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
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
                                                    draggable={item?.id?.startsWith("schedule")}
                                                    onDragStart={(e) => handleDragStart(e, item)}
                                                    onDragEnd={handleDragEnd}
                                                    onMouseDown={e => e.stopPropagation()}
                                                    style={{
                                                        height: `${(item.endSlot - item.startSlot + 1) * 48}px`,
                                                        width,
                                                        left,
                                                        zIndex: 10 + overlapIndex,
                                                        top: 0,
                                                        pointerEvents: isDragging && draggedItem?.id !== item.id ? 'none' : 'auto',
                                                        position: 'absolute',
                                                        border: '1.5px solid #1976d2',
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
                                                    <Dropdown
                                                        disabled={!item?.id?.startsWith("schedule")}
                                                        placement={"bottomRight"}
                                                        className={"z-50 absolute top-0 right-0 w-full h-full"}
                                                        trigger={["click"]}
                                                        dropdownRender={() => (
                                                            <Box className={" p-5 rounded-md shadow-xl bg-white"}>
                                                                
                                                                <Select
                                                                    showSearch
                                                                    className={"min-w-[400px] "}
                                                                    options={options}
                                                                    placeholder={"Chọn phòng học"}
                                                                    onChange={e => {
                                                                        setScheduledItems(prevState => [
                                                                            ...prevState?.filter(e2 => e2.id !== item.id),
                                                                            {
                                                                                ...item,
                                                                                roomCode: e,
                                                                            } as ScheduleItem
                                                                        ]);
                                                                    }}
                                                                />
                                                                <Tooltip title={"Xoá tiết học"}>
                                                                    <IconButton onClick={() => handleDelete(item.id)}>
                                                                        <Trash2 size={18} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    />
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
                                        {/* Drag preview */}
                                        {isPreview && (
                                            <div className="absolute inset-1 bg-green-300 border-2 border-dashed border-green-500 rounded flex items-center justify-center z-5">
                                                <span className="text-green-700 text-xs font-medium">
                                                    {dragPreview && dragPreview.endSlot - dragPreview.startSlot + 1} tiết
                                                </span>
                                            </div>
                                        )}
                                        {/* Plus icon */}
                                        {!inSelection && !isPreview && items.length === 0 && (
                                            <div className="absolute inset-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Plus className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TableSchedule;