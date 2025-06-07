import { Card } from "@/app/components/ui/card.tsx";
import { GripVertical, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Space, Spin, Typography, Alert } from "antd";
import {useGetCourseClasses} from "@/app/modules/student/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/student/hooks/useGetTimeline.ts";
import {daysOfWeek, timeSlots} from "@/app/modules/student/pages/student_timeline.tsx";

export type SubjectTimeProps = {
    courseClassCode: string[];
    teacherCourseClassCode?: string[];
    semesterCode?: string;
};
export interface ScheduleItem {
    id: string
    title: string
    subject: string
    color: string
    startSlot: number
    endSlot: number
    dayIndex: number
    duration: number
}

const SubjectTime = (props: SubjectTimeProps) => {
    const { data: timeline, isLoading } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: [...props.courseClassCode, ...(props?.teacherCourseClassCode ?? [])]
                        .filter((e) => e !== "")
                        .join(","),
                },
            ],
        },
        props?.courseClassCode !== undefined &&
        [...props.courseClassCode, ...(props?.teacherCourseClassCode ?? [])].filter((e) => e !== "")
            .length > 0
    );
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(
        null
    );
    const [isDragging, setIsDragging] = useState(false);
    const [slotConflict, setSlotConflict] = useState<string | null>(null);

    const { data: courseClasses } = useGetCourseClasses(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: [...props.courseClassCode, ...(props?.teacherCourseClassCode ?? [])]
                        .filter((e) => e !== "")
                        .join(","),
                },
            ],
        },
        props?.courseClassCode !== undefined &&
        [...props.courseClassCode, ...(props?.teacherCourseClassCode ?? [])].filter((e) => e !== "")
            .length > 0
    );

    useEffect(() => {
        setScheduledItems([]);
    }, [timeline]);

    useEffect(() => {
        if (
            timeline?.data?.data?.items &&
            props.courseClassCode &&
            props.courseClassCode.length > 0 &&
            props.teacherCourseClassCode &&
            props.teacherCourseClassCode.length > 0
        ) {
            const items = timeline.data.data.items;
            const mainItems = items.filter((i) => props.courseClassCode.includes(i.courseClassCode));
            const teacherItems = items.filter((i) => props.teacherCourseClassCode!.includes(i.courseClassCode));
            let foundConflict = null;
            outer: for (const a of mainItems) {
                for (const b of teacherItems) {
                    if (
                        a.dayOfWeek === b.dayOfWeek &&
                        a.slots.some((slot: string) => b.slots.includes(slot))
                    ) {
                        foundConflict = `Lịch bị trùng giữa lớp ${a.courseClassCode} và lớp ${b.courseClassCode} vào ngày ${daysOfWeek[a.dayOfWeek]} (tiết ${a.slots.join(
                            ", "
                        )} và ${b.slots.join(", ")})`;
                        break outer;
                    }
                }
            }
            setSlotConflict(foundConflict);
        } else {
            setSlotConflict(null);
        }
    }, [timeline, props.courseClassCode, props.teacherCourseClassCode]);

   
    

    
    const isSlotOccupied = (dayIndex: number, slotIndex: number) => {
        return scheduledItems.some(
            (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot
        );
    };

    const getItemAtSlot = (dayIndex: number, slotIndex: number) => {
        return scheduledItems.find(
            (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot
        );
    };

    const isInSelection = (dayIndex: number, slotIndex: number) => {
        if (!isSelecting || !selectionStart || !selectionEnd || isDragging) return false;
        if (dayIndex !== selectionStart.dayIndex) return false;

        const startSlot = Math.min(selectionStart.slotIndex, selectionEnd.slotIndex);
        const endSlot = Math.max(selectionStart.slotIndex, selectionEnd.slotIndex);

        return slotIndex >= startSlot && slotIndex <= endSlot;
    };

    
 
    

    const isPreviewSlot = (dayIndex: number, slotIndex: number) => {
        return (
            dragPreview &&
            dragPreview.dayIndex === dayIndex &&
            slotIndex >= dragPreview.startSlot &&
            slotIndex <= dragPreview.endSlot
        );
    };

    useEffect(() => {
        if (timeline) {
            setScheduledItems((prevState) => [
                ...prevState,
                ...(timeline?.data?.data?.items?.map((c) => {
                    return {
                        id: c?.id,
                        title: `${c?.courseClassCode} - ${
                            courseClasses?.data?.data?.items?.find((e) => e.courseClassCode === c?.courseClassCode)
                                ?.teacherName ?? "Chưa xếp giáo viên"
                        }`,
                        subject: "Đã có tiết",
                        color: `${
                            !props?.teacherCourseClassCode?.includes(c?.courseClassCode)
                                ? "bg-blue-100"
                                : "bg-red-100"
                        } text-blue-800 border-blue-200`,
                        startSlot: +c?.slots[0],
                        endSlot: +c?.slots[c.slots?.length - 1],
                        dayIndex: c?.dayOfWeek,
                        duration: c.slots?.length,
                    } as unknown as ScheduleItem;
                }) ?? []),
            ]);
        }
    }, [timeline, courseClasses]);

    return (
        <>
            {slotConflict && (
                <Alert
                    message="Lỗi trùng lịch"
                    description={slotConflict}
                    type="error"
                    showIcon
                    className="my-2"
                />
            )}
            <Card className="relative">
                {isLoading && (
                    <Space className={"absolute top-1/2 left-1/2 z-50"}>
                        <Spin size={"large"} />
                    </Space>
                )}

                <div
                    className="grid grid-cols-8 gap-0 select-none "
                >
                    {/* Header */}
                    <div className="bg-gray-50 p-3 border-b border-r font-medium text-center text-sm">
                        Tiết học
                    </div>
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="bg-gray-50 p-3 border-b border-r font-medium text-center text-sm"
                        >
                            {day}
                        </div>
                    ))}

                    {/* Time slots */}
                    {timeSlots.map((slot, slotIndex) => (
                        <div key={slot.id} className="contents">
                            <div className="p-3 border-b border-r bg-gray-50">
                                <div className="text-sm font-medium">{slot.period}</div>
                                <div className="text-xs text-gray-500">{slot.time}</div>
                            </div>

                            {daysOfWeek.map((day, dayIndex) => {
                                const isOccupied = isSlotOccupied(dayIndex, slotIndex);
                                const item = getItemAtSlot(dayIndex, slotIndex);
                                const isItemStart = item && item.startSlot === slotIndex;
                                const inSelection = isInSelection(dayIndex, slotIndex);
                                const isPreview = isPreviewSlot(dayIndex, slotIndex);

                                return (
                                    <div
                                        key={`${dayIndex}-${slotIndex}`}
                                        className={`
                                            p-1 border-b border-r min-h-[50px] transition-all duration-200 relative
                                            ${inSelection ? "bg-blue-200 border-blue-400" : ""}
                                            ${isPreview ? "bg-green-200 border-green-400 border-2 border-dashed" : ""}
                                            ${
                                            !isOccupied && !inSelection && !isPreview
                                                ? "hover:bg-gray-50 cursor-pointer"
                                                : ""
                                        }
                                        `}
                                    >
                                        {isOccupied && isItemStart && item && (
                                            <div
                                                
                                                className={`
                                                    ${item.color} px-2 py-1 rounded text-sm font-medium cursor-move 
                                                    flex flex-col gap-1 transition-all duration-200
                                                    absolute inset-1 z-10 border-2 border-transparent
                                                    hover:border-gray-400 hover:shadow-lg hover:scale-105
                                                    ${draggedItem?.id === item.id ? "opacity-50" : ""}
                                                `}
                                                style={{
                                                    height: `${(item.endSlot - item.startSlot + 1) * 48}px`,
                                                }}
                                            >
                                                <div className="flex items-center gap-1 pointer-events-none">
                                                    <GripVertical className="w-3 h-3" />
                                                    <Typography style={{ fontSize: "12px" }} className={""}>
                                                        {item.title}
                                                    </Typography>
                                                </div>
                                                <span className="text-xs opacity-75 pointer-events-none">
                                                    {item.duration} tiết
                                                </span>
                                                <span className="text-xs opacity-75 pointer-events-none">
                                                    Tiết {item.startSlot + 1}-{item.endSlot + 1}
                                                </span>
                                            </div>
                                        )}

                                        {isPreview && (
                                            <div className="absolute inset-1 bg-green-300 border-2 border-dashed border-green-500 rounded flex items-center justify-center z-5">
                                                <span className="text-green-700 text-xs font-medium">
                                                    {dragPreview &&
                                                        dragPreview.endSlot - dragPreview.startSlot + 1}{" "}
                                                    tiết
                                                </span>
                                            </div>
                                        )}

                                        {!isOccupied && !inSelection && !isPreview && (
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
        </>
    );
};
export default SubjectTime;