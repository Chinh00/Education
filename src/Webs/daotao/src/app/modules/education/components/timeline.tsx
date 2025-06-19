import {Card} from "@/app/components/ui/card.tsx";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {CircleCheck, Plus, Trash2} from "lucide-react";
import {Dropdown, Select, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {ScheduleItem} from "@/domain/schedule_item.ts";
import {Box, IconButton} from "@mui/material";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {getOverlappingPairs} from "@/app/modules/education/components/overlapUtils.ts";
import {useGetRoomFreeSlots} from "@/app/modules/education/hooks/useGetRoomFreeSlots.ts";
import {SearchRoomFreeQueryModel} from "@/app/modules/education/services/courseClass.service.ts";
import {useRemoveCourseClassSlotTimeline} from "@/app/modules/education/hooks/useRemoveCourseClassSlotTimeline.ts";
import toast from "react-hot-toast";
import {useAddCourseClassSlotTimeline} from "@/app/modules/education/hooks/useAddCourseClassSlotTimeline.ts";
import {useGetSubjectScheduleConfig} from "@/app/modules/education/hooks/useGetSubjectScheduleConfig.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";

export type TimelineProps = {
    courseClass: CourseClass | undefined,
    listCourseClassesRelative?: string[]
}
const Timeline = ({courseClass, listCourseClassesRelative}: TimelineProps) => {
    const [courseClassType, setCourseClassType] = useState(0);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common);
    const {data: subjectScheduleConfigs} = useGetSubjectScheduleConfig({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: currentParentSemester?.semesterCode!
            },
            {
                field: "Stage",
                operator: "==",
                value: `${courseClass?.stage}`
            },
            
        ]
    }, courseClass?.stage !== undefined && currentParentSemester?.semesterCode !== undefined);
    const subjectScheduleConfig = subjectScheduleConfigs?.data?.data?.items?.[0];
    const theorySessions = subjectScheduleConfig?.theorySessions || [];
    const practiceSessions = subjectScheduleConfig?.practiceSessions || [];
    
    

    
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


    const createScheduleBlock = () => {
        if (!selectionStart || !selectionEnd) return;
        const start = selectionStart.slotIndex;
        const end = selectionEnd.slotIndex;
        const dayIndex = selectionStart.dayIndex;
        const validStartSlot = Math.min(start, end);
        const validEndSlot = Math.max(start, end);

        if (validStartSlot < 0 || validEndSlot >= timeSlots.length) return;

        const newItem: ScheduleItem = {
            id: `schedule-${Date.now()}-${Math.random()}`,
            title: ``,
            subject: courseClassType === 0 ? "Lý thuyết" : "Thực hành",
            color:
                courseClassType === 0
                    ? `bg-blue-100 text-blue-800 border-blue-200`
                    : "bg-green-100 text-green-800 border-green-200",
            startSlot: validStartSlot,
            endSlot: validEndSlot,
            dayIndex,
            duration: validEndSlot - validStartSlot + 1,
            courseClassCode: courseClass?.courseClassCode
        };
        setScheduledItems(prevState => [...prevState, newItem]);
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
        
        
        setDragPreview(null);
        setDraggedItem(null);
        setIsDragging(false);
    };

    const {mutate: removeMutateCourseClassSlotTimeline, reset: removeSlotTimelineReset, isPending: removeSlotTimelineLoading} = useRemoveCourseClassSlotTimeline()
    const {mutate: addSlotTimelineMutate, reset: addSlotTimelineReset, isPending: addSlotTimelineLoading} = useAddCourseClassSlotTimeline()
    const [selectedRoomCode, setSelectedRoomCode] = useState("");
    const handleSaveNewSlotTimeline = (dayOfWeek: number, sessionLength: number, startPeriod: number) => {
        if (!courseClass || !selectedRoomCode || sessionLength <= 0 || startPeriod < 0) {
            toast.error("Vui lòng chọn đầy đủ thông tin");
            return;
        }
        addSlotTimelineMutate({
            courseClassCode: courseClass?.courseClassCode || "",
            roomCode: selectedRoomCode,
            dayOfWeek,
            slots: Array.from({ length: sessionLength }, (_, i) => (startPeriod + i).toString())
        }, {
            onSuccess: () => {
                toast.success("Đã lưu tiết học thành công");
                setScheduledItems([])
                addSlotTimelineReset();
                timelineRefetch()
            },
            onError: (error) => {
                console.error("Error adding slot timeline:", error);
            }
        })
    }
    const handleDelete = (itemId: string) => {
        if (!itemId?.startsWith("schedule-")) {
            removeMutateCourseClassSlotTimeline({
                courseClassCode: courseClass?.courseClassCode || "",
                slotTimelineId: itemId
            }, {
                onSuccess: () => {
                    toast.success("Đã xoá tiết học thành công");
                    setScheduledItems(prev => prev.filter(i => i.id !== itemId));
                    removeSlotTimelineReset();
                    setScheduledItems([])
                    timelineRefetch()
                },
                onError: (error) => {
                    console.error("Error removing slot timeline:", error);
                }
            })
        } else {
            setScheduledItems(prev => prev.filter(i => i.id !== itemId));
        }
        
    };

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [selectedRoomQuery, setSelectedRoomQuery] = useState<SearchRoomFreeQueryModel>({
        
    });
    const {data: roomsAvailable, isLoading: roomsAvailableLoading} = useGetRoomFreeSlots(
        selectedRoomQuery,
        selectedRoomQuery?.dayOfWeek !== undefined &&
        selectedRoomQuery?.sessionLength !== undefined &&
        !!openDropdownId
    );
    useEffect(() => {
        if (courseClass) {
            if (courseClass?.stage === 0 || courseClass?.stage === 2) {
                setSelectedRoomQuery(prevState => ({
                    ...prevState,
                    stages: [courseClass?.stage, 2],
                }))
            }
            if (courseClass?.stage === 1 || courseClass?.stage === 3) {
                setSelectedRoomQuery(prevState => ({
                    ...prevState,
                    stages: [courseClass?.stage, 3],
                }))
            }
        }
    }, [courseClass]);
    const {data: timelines, refetch: timelineRefetch, isSuccess} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: listCourseClassesRelative?.join(",")!
            }
        ]
    }, !!courseClass?.courseClassCode && courseClass?.courseClassCode !== "" && listCourseClassesRelative != undefined && listCourseClassesRelative.length > 0);
    useEffect(() => {
        if (timelines?.data?.data?.items) {
            const items: ScheduleItem[] = timelines.data.data.items.map((item: SlotTimeline, index) => ({
                id: item.id,
                title: item.courseClassCode?.includes("LT") ? "LC" : "LTP",
                subject: "",
                color: `${courseClass?.courseClassCode === item.courseClassCode ? "bg-[#42a5f5]" : "bg-red-200"} text-blue-800 border-blue-200`,
                startSlot: +item?.slots[0],
                endSlot: +item?.slots[item?.slots.length - 1],   
                dayIndex: item.dayOfWeek,
                duration: item?.slots?.length,
                roomCode: item.roomCode,
                courseClassCode: item?.courseClassCode
            }));
            setScheduledItems(prevState => [...prevState, ...items]);
        }
    }, [timelines]);
    function countUniquePracticeClasses(data: ScheduleItem[], courseClassType: string = "-LT"): Record<string, number> {
        const result: Record<string, number> = {}
        listCourseClassesRelative?.map(t => {
            result[t] = 0
            
        })
        for (const item of data) {
            if (item?.courseClassCode?.includes(courseClassType)) {
                result[item.courseClassCode] = (result[item.courseClassCode] || 0) + 1;
            }
        }
        return result;
    }

    const [alters, setAlters] = useState<Record<string, string[]>>()


    // useEffect(() => {
    //     if (isSuccess) {
    //         const newAlters: Record<string, string[]> = {};
    //
    //         const theoryCount = countUniquePracticeClasses(scheduledItems, "-LT");
    //         Object.entries(theoryCount).forEach(([itemCode, count]) => {
    //             if (theoryCount[itemCode] !== theorySessions?.length) {
    //                 if (!newAlters[itemCode]) newAlters[itemCode] = [];
    //                 newAlters[itemCode].push(`Lớp học lý thuyết ${itemCode} chưa đủ số buổi học lý thuyết (${theorySessions?.length} buổi)`);
    //             }
    //         });
    //
    //         const practiceCount = countUniquePracticeClasses(scheduledItems, "_TH");
    //         Object.entries(practiceCount).forEach(([itemCode, count]) => {
    //             if (practiceCount[itemCode] !== practiceSessions?.length) {
    //                 if (!newAlters[itemCode]) newAlters[itemCode] = [];
    //                 newAlters[itemCode].push(`Lớp học thực hành ${itemCode} chưa đủ số buổi học thực hành (${practiceSessions?.length} buổi)`);
    //             }
    //         });
    //
    //         setAlters(newAlters);
    //     }
    // }, [scheduledItems, isSuccess]);
    //
    //
    
    
    
    return (
        <div className={"px-5"}>
            <div className={"flex flex-col gap-2"}>
                {alters && Object.keys(alters).length > 0 && (
                    <div className={"text-red-500 text-sm"}>
                        <ul>
                            {Object.entries(alters).map(([itemCode, messages]) => (
                                messages.map((message, index) => (
                                    <li key={`${itemCode}-${index}`}>{message}</li>
                                ))
                            ))}
                        </ul>
                    </div>
                )}
                
            </div>
            
            
            <Card className={"w-full p-0"}>
                <div
                    className="grid grid-cols-8 gap-0 select-none col-span-8"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
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
                                const inSelection = isInSelection(dayIndex, slotIndex);
                                const isPreview = isPreviewSlot(dayIndex, slotIndex);

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
                                                    className={`${item?.color}`}
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
                                                        // border: '1.5px solid #1976d2',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
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
                                                        placement={"bottomRight"}
                                                        disabled={item.courseClassCode !== courseClass?.courseClassCode}
                                                        className={"z-50 absolute top-0 right-0 w-full h-full"}
                                                        trigger={["click"]}
                                                        open={openDropdownId === item.id}
                                                        onOpenChange={(open) => {
                                                            if (open) {
                                                                setSelectedRoomQuery(prevState => ({
                                                                    ...prevState,
                                                                    dayOfWeek: item.dayIndex,
                                                                    sessionLength: item.duration,
                                                                    startPeriod: item.startSlot,
                                                                }));
                                                                setOpenDropdownId(item.id);
                                                            } else {
                                                                setOpenDropdownId(null);
                                                            }
                                                        }}
                                                        dropdownRender={() => (
                                                            <Box className={"p-5 rounded-md shadow-xl bg-white"}>
                                                                <Select
                                                                    showSearch
                                                                    className={"min-w-[400px] "}
                                                                    options={roomsAvailable?.data?.data?.items?.map(e => ({
                                                                        label: `${e?.code} (${e?.capacity})`,
                                                                        value: e?.code
                                                                    })) ?? []}
                                                                    loading={roomsAvailableLoading}
                                                                    placeholder={"Chọn phòng học"}
                                                                    onChange={e => {
                                                                        setSelectedRoomCode(e);
                                                                        setScheduledItems(prev => prev.map(i => {
                                                                            if (i.id === item.id) {
                                                                                return {
                                                                                    ...i,
                                                                                    roomCode: e
                                                                                };
                                                                            }
                                                                            return i;
                                                                        }));
                                                                    }}
                                                                />
                                                                <Tooltip title={"Xoá tiết học"}>
                                                                    <IconButton loading={removeSlotTimelineLoading} onClick={() => handleDelete(item.id)}>
                                                                        <Trash2 size={18} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {item?.id?.startsWith("schedule-") && (
                                                                    <Tooltip title={"Lưu tiết học"}>
                                                                        <IconButton color={"primary"} loading={addSlotTimelineLoading} onClick={() => handleSaveNewSlotTimeline(item.dayIndex, item.duration, item.startSlot - 1)}>
                                                                            <CircleCheck size={18} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                
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
            </Card>
        </div>
    );
};

export default Timeline;