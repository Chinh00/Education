import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import React, {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Button as ButtonAntd, Input} from "antd"
import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {GripVertical, Plus} from "lucide-react";
import {CourseClassModel, SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {useForm} from "react-hook-form";
import {useCreateCourseClass} from "@/app/modules/education/hooks/useCreateCourseClass.ts";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
import {Query} from "@/infrastructure/query.ts";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";




const TeacherTimeline = () => {const dispatch = useAppDispatch();
    const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Thời khóa biểu giáo viên" }));
    }, []);
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])

    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [timelineCommit, setTimelineCommit] = useState<{schedule: SlotTimelineModel, id: string}[]>([])

    


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
        if (isSelecting && selectionStart && selectionEnd && !isDragging) {
            createScheduleBlock()
        }

        setIsSelecting(false)
        setSelectionStart(null)
        setSelectionEnd(null)
    }

    const createScheduleBlock = () => {
        if (!selectionStart || !selectionEnd) return

        const startSlot = Math.min(selectionStart.slotIndex, selectionEnd.slotIndex)
        const endSlot = Math.max(selectionStart.slotIndex, selectionEnd.slotIndex)
        const dayIndex = selectionStart.dayIndex
        const duration = endSlot - startSlot + 1

        // Check for conflicts
        const hasConflict = scheduledItems.some(
            (item) => item.dayIndex === dayIndex && !(item.endSlot < startSlot || item.startSlot > endSlot),
        )

        if (hasConflict) {
            return
        }

        const newItem: ScheduleItem = {
            id: `schedule-${Date.now()}`,
            title: `Buổi học ${scheduledItems.length + 1}`,
            subject: "Lớp học",
            color:
                true
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200",
            startSlot,
            endSlot,
            dayIndex,
            duration,
        }

        setScheduledItems((prev) => [...prev, newItem])
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

    const deleteScheduleItem = (itemId: string) => {
        setScheduledItems((prev) => prev.filter((item) => item.id !== itemId))
        setTimelineCommit(prevState => prevState.filter((item) => item.id !== itemId))
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
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
    const [staffCode, setStaffCode] = useState("")

    const [query, setQuery] = useState<Query>({
        
    })

    useEffect(() => {
        if (staffCode) {
            setQuery({
                Filters: [
                    {
                        field: "TeacherCode",
                        operator: '==',
                        value: staffCode!,
                    }
                ]
            })
        }
    }, [staffCode]);
    const {data: courseClasses} = useGetCourseClasses(query, query?.Filters?.filter(c => c.field === "TeacherCode") !== undefined)
    
    const {data: timeline} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: courseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            }
        ]
    }, courseClasses !== undefined && courseClasses?.data?.data?.items?.length > 0)

    useEffect(() => {
        if (timeline) {
            setScheduledItems(prevState => [
                ...prevState,
                ...timeline?.data?.data?.items?.map(c => {
                    return {
                        id: c?.id,
                        title: c?.courseClassCode,
                        subject: "Đã có tiết",
                        color: "bg-red-100 text-blue-800 border-blue-200",
                        startSlot: +c?.slots[0],
                        endSlot: +c?.slots[c.slots?.length - 1],
                        dayIndex: c?.dayOfWeek,
                        duration: c.slots?.length
                    } as unknown as ScheduleItem
                }) ?? [],
            ])
        }
    }, [timeline]);
    
    


    
    

    

    
    
    
    
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"space-y-5"}>
                <Input.Search size={"large"} placeholder={"Tìm theo mã giáo viên"} onSearch={(e) => setStaffCode(e)} />


                <Card>
                    <CardContent className="p-0">
                        <div
                            className="grid grid-cols-8 gap-0 select-none"
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* Header */}
                            <div className="bg-gray-50 p-3 border-b border-r font-medium text-center text-sm">Tiết học</div>
                            {daysOfWeek.map((day) => (
                                <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center text-sm">
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
                                        const isOccupied = isSlotOccupied(dayIndex, slotIndex)
                                        const item = getItemAtSlot(dayIndex, slotIndex)
                                        const isItemStart = item && item.startSlot === slotIndex
                                        const inSelection = isInSelection(dayIndex, slotIndex)
                                        const isPreview = isPreviewSlot(dayIndex, slotIndex)

                                        return (
                                            <div
                                                key={`${dayIndex}-${slotIndex}`}
                                                className={`
                            p-1 border-b border-r min-h-[50px] transition-all duration-200 relative
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
                                                        draggable={false}
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
                                                            <span className="truncate">{item.title}</span>
                                                        </div>
                                                        <span className="text-xs opacity-75 pointer-events-none">{item.duration} tiết</span>
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
            </Box>
        </PredataScreen>
    )
}
export default TeacherTimeline;