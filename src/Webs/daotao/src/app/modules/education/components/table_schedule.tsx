import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {CalendarRange, GripVertical, Plus} from "lucide-react";
import {Button, Button as ButtonAntd, List, Modal, Table, Tooltip, Typography} from "antd";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
import {ColumnsType, useGetRooms} from "@/app/modules/common/hook.ts";
import {Room} from "@/domain/room.ts";
import {Subject} from "@/domain/subject.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import SelectedClassModal from "@/app/modules/education/components/selected_class_modal.tsx";
import {setScheduleItem, SubjectStudySectionState} from "@/app/modules/education/stores/subject_study_section.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";

export type TableScheduleProps = {
    subject?: Subject,
    onChange?: (scheduleItems: ScheduleItem[]) => void,
}

const TableSchedule = ({subject, onChange}: TableScheduleProps) => {


    const [courseClassType, setCourseClassType] = useState(0)

    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const { courseClassesNew } = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);

    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (scheduledItems?.length > 0) {
            onChange?.(scheduledItems)
        }
    }, [scheduledItems]);
    
    
    const handleMouseDown = (dayIndex: number, slotIndex: number, e: React.MouseEvent) => {
        e.preventDefault()

        const existingItem = getItemAtSlot(dayIndex, slotIndex)
        if (existingItem && existingItem.startSlot === slotIndex) {
            return
        }

        if (!existingItem) {
            setIsSelecting(true)
            setSelectionStart({ dayIndex, slotIndex })
            setSelectionEnd({ dayIndex, slotIndex })
        }
    }

    const handleMouseEnter = (dayIndex: number, slotIndex: number) => {
        if (isSelecting && selectionStart && !isDragging) {
            if (dayIndex === selectionStart.dayIndex) {
                setSelectionEnd({ dayIndex, slotIndex })
            }
        }
    }

    const handleMouseUp = () => {
        if (isSelecting && selectionStart && selectionEnd && !isDragging ) {
            createScheduleBlock()
        }

        setIsSelecting(false)
        setSelectionStart(null)
        setSelectionEnd(null)
    }
    const FIXED_DURATION = 3;

    const createScheduleBlock = () => {
        if (!selectionStart || !selectionEnd) return

        const start = selectionStart.slotIndex
        const end = selectionEnd.slotIndex
        const dayIndex = selectionStart.dayIndex
        const isForward = end >= start
        const startSlot = isForward ? start : start - FIXED_DURATION + 1
        const validStartSlot = Math.max(0, startSlot)
        const validEndSlot = validStartSlot + FIXED_DURATION - 1

        if (validStartSlot < 0 || validEndSlot >= timeSlots.length) return


        const selectionLength = Math.abs(end - start) + 1
        if (selectionLength < FIXED_DURATION) return

        const hasConflict = scheduledItems.some( (item) => item.dayIndex === dayIndex && !(item.endSlot < validStartSlot || item.startSlot > validEndSlot)
        )
        if (hasConflict) return

        const newItem: ScheduleItem = {
            id: `schedule-${Date.now()}`,
            title: `${scheduledItems.length + 1}`,
            subject: courseClassType === 0 ? "Lý thuyết" : "Thực hành",
            color:
                courseClassType === 0
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200",
            startSlot: validStartSlot,
            endSlot: validEndSlot,
            dayIndex,
            duration: FIXED_DURATION,
        }
        setScheduledItems((prev) => [...prev, newItem])

        setIsDragging(false)
        setOpen(true)
        dispatch(setScheduleItem(newItem))
    }

    const isSlotOccupied = (dayIndex: number, slotIndex: number) => {
        return scheduledItems.some(
            (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
        )
    }

    const getItemAtSlot = (dayIndex: number, slotIndex: number) => {
        return scheduledItems.find(
            (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
        )
    }

    const isInSelection = (dayIndex: number, slotIndex: number) => {
        if (!isSelecting || !selectionStart || !selectionEnd || isDragging) return false

        if (dayIndex !== selectionStart.dayIndex) return false

        const startSlot = Math.min(selectionStart.slotIndex, selectionEnd.slotIndex)
        const endSlot = Math.max(selectionStart.slotIndex, selectionEnd.slotIndex)

        return slotIndex >= startSlot && slotIndex <= endSlot
    }

    

    const handleDragStart = (e: React.DragEvent, item: ScheduleItem) => {
        setDraggedItem(item)
        setIsDragging(true)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", item.id)

        // Create a custom drag image
        const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
        dragImage.style.transform = "rotate(5deg)"
        dragImage.style.opacity = "0.8"
        e.dataTransfer.setDragImage(dragImage, 50, 25)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragPreview(null)
        setIsDragging(false)
    }

    

    const handleCellDragOver = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault()

        if (!draggedItem) return

        const endSlot = Math.min(slotIndex + draggedItem.duration - 1, timeSlots.length - 1)
        setDragPreview({
            dayIndex,
            startSlot: slotIndex,
            endSlot,
        })
    }

    const handleDragLeave = () => {
        // Only clear preview if we're leaving the entire grid area
        setTimeout(() => {
            if (!isDragging) {
                setDragPreview(null)
            }
        }, 50)
    }

    const handleDrop = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault()

        if (!draggedItem) return

        const duration = draggedItem.duration
        const endSlot = slotIndex + duration - 1

        if (endSlot >= timeSlots.length) {
            setDragPreview(null)
            setDraggedItem(null)
            setIsDragging(false)
            return
        }

        const hasConflict = scheduledItems.some(
            (item) =>
                item.dayIndex === dayIndex &&
                item.id !== draggedItem.id &&
                !(item.endSlot < slotIndex || item.startSlot > endSlot),
        )

        if (hasConflict) {
            setDragPreview(null)
            setDraggedItem(null)
            setIsDragging(false)
            return
        }

        // Update the item position
        setScheduledItems((prev) =>
            prev.map((item) => (item.id === draggedItem.id ? { ...item, dayIndex, startSlot: slotIndex, endSlot } : item)),
        )


        setDragPreview(null)
        setDraggedItem(null)
        setIsDragging(false)
    }

    const isPreviewSlot = (dayIndex: number, slotIndex: number) => {
        return (
            dragPreview &&
            dragPreview.dayIndex === dayIndex &&
            slotIndex >= dragPreview.startSlot &&
            slotIndex <= dragPreview.endSlot
        )
    }
    
    

    const columns: ColumnsType<Room> = [
        {
            title: <span className={"whitespace-nowrap"}>Tên phòng</span>,
            dataIndex: "code",
            className: "text-[12px]",
        },
    ];
    
    
    const { } = useGetCourseClasses({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject?.subjectCode ?? "",
            }            
        ]
    }, subject?.subjectCode !== "")
    const [open, setOpen] = useState(false)

    return (
        <Card className={"h-fit p-0"}>
            
            
            
            <CardContent className="grid grid-cols-8 p-0">
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
                                const isOccupied = isSlotOccupied(dayIndex, slotIndex)
                                const item = getItemAtSlot(dayIndex, slotIndex)
                                const isItemStart = item && item.startSlot === slotIndex
                                const inSelection = isInSelection(dayIndex, slotIndex)
                                const isPreview = isPreviewSlot(dayIndex, slotIndex)

                                return (
                                    <div
                                        key={`${dayIndex}-${slotIndex}`}
                                        className={`
                            p-1 border-b border-r  transition-all duration-200 relative
                            ${inSelection ? "bg-blue-200 border-blue-400" : ""}
                            ${isPreview ? "bg-green-200 border-green-400 border-2 border-dashed" : ""}
                            ${!isOccupied && !inSelection && !isPreview ? "hover:bg-gray-50 cursor-pointer" : ""}
                          `}
                                        onMouseDown={(e) => handleMouseDown(dayIndex, slotIndex, e)}
                                        onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                        onDragOver={(e) => handleCellDragOver(e, dayIndex, slotIndex)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
                                    >
                                        {isOccupied && isItemStart && item && (
                                            <div
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, item)}
                                                onDragEnd={handleDragEnd}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation()
                                                }}
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
                                                    <Typography style={{fontSize: "12px"}} className={"flex flex-row justify-start items-center gap-1"}>
                                                        <CalendarRange size={15} />
                                                        {item.title}
                                                    </Typography>
                                                </div>

                                                <span className="text-xs opacity-75 pointer-events-none">
                                                    Tiết {item.startSlot + 1}-{item.endSlot + 1}
                                                </span>
                                            </div>
                                        )}

                                        {isPreview && (
                                            <div className="absolute inset-1 bg-green-300 border-2 border-dashed border-green-500 rounded flex items-center justify-center z-5">
                              <span className="text-green-700 text-xs font-medium">
                                {dragPreview && dragPreview.endSlot - dragPreview.startSlot + 1} tiết
                              </span>
                                            </div>
                                        )}

                                        {!isOccupied && !inSelection && !isPreview && (
                                            <div className="absolute inset-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Plus className="w-4 h-4 text-gray-400" />
                                                
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default TableSchedule;