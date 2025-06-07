import React, {useEffect, useState} from "react";
import {Button, Modal, Select, Tooltip, Typography} from "antd";
import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {GripVertical, Plus} from "lucide-react";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
import {SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {Query} from "@/infrastructure/query.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {Eye} from "lucide-react"
import {IconButton} from "@mui/material";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
export type TeacherTimelineModalProps = {
    staffCode?: string
}

const TeacherTimelineModal = ({staffCode}: TeacherTimelineModalProps) => {
    const [openModel, setOpenModel] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])

    



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
        }

        setIsSelecting(false)
        setSelectionStart(null)
        setSelectionEnd(null)
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


    const [selectedCourseClassStage, setSelectedCourseClassStage] = useState(3)

    const [selectedSubjectCode, setSelectedSubjectCode] = useState("")

    const {data: courseClasses} = useGetCourseClasses(
        selectedCourseClassStage !== 3 ?
        {
        Filters: [
            {
                field: "TeacherCode",
                operator: "==",
                value: staffCode ?? ""
            },
            {
                field: "Stage",
                operator: "==",
                value: `${selectedCourseClassStage}`
            }
            
        ]
    } : {
            Filters: [
                {
                    field: "TeacherCode",
                    operator: "==",
                    value: staffCode ?? ""
                }
            ]
            }, staffCode !== undefined && staffCode !== "" && openModel)

    const {data: timeline, isLoading: timelineLoading} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: courseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            }
        ]
    }, courseClasses !== undefined && courseClasses?.data?.data?.items?.length > 0 && openModel)

    useEffect(() => {
        if (courseClasses && courseClasses?.data?.data?.items?.length === 0) {
            setScheduledItems([])
        }
    }, [courseClasses]);
    
    
    useEffect(() => {
        setScheduledItems([])
        if (timeline) {
            setScheduledItems(prevState => [
                ...prevState,
                ...timeline?.data?.data?.items?.filter(e => courseClasses?.data?.data?.items?.filter(c => selectedSubjectCode !== "" ? c.subjectCode === selectedSubjectCode : true)?.map(d => d.courseClassCode)?.includes(e.courseClassCode)).map(c => {
                    return {
                        id: c?.id,
                        title: `${c?.courseClassCode} (${getStage[courseClasses?.data?.data?.items?.find(cc => cc.courseClassCode === c?.courseClassCode)?.stage ?? 0]})`,
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
    }, [timeline, selectedSubjectCode]);

    const {data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: courseClasses?.data?.data?.items?.map(c => c.subjectCode)?.join(",")!
            }
        ]
    }, courseClasses && courseClasses?.data?.data?.items?.length > 0 && openModel)

    
    
    const handleStageChange = (value: number) => { 
        setSelectedCourseClassStage(value)
        setSelectedSubjectCode("")
    };
    const getSubject = (subjectCode: string) => subjects?.data?.data?.items?.find(s => s.subjectCode === subjectCode);
    
    return (
        <>
            <Tooltip title={"Chi tiết thời khóa biểu"}><IconButton onClick={() => setOpenModel(true)}><Eye size={18} /></IconButton></Tooltip>
            <Modal open={openModel} className={"min-w-[1200px] "} onCancel={() => setOpenModel(false)}>
                <Card>
                    <CardContent className="flex justify-between items-center">
                        <Typography.Title level={5} >Thông tin giảng viên</Typography.Title>
                    </CardContent>
                </Card>
                
                <div className={"flex flex-row py-5 gap-3"}>
                    <Select onChange={handleStageChange} defaultValue={3} className={"min-w-[150px]"}>
                        <Select.Option value={0}>Giai đoạn 1</Select.Option>
                        <Select.Option value={1}>Giai đoạn 2</Select.Option>
                        <Select.Option value={2}>Cả 2 giai đoạn</Select.Option>
                        <Select.Option value={3}>Tất cả</Select.Option>
                    </Select>

                    <Select onChange={(e) => {
                        setSelectedSubjectCode(e)
                    }} className={"min-w-[150px]"}>
                        {courseClasses && courseClasses?.data?.data?.items?.map((subject) => (
                            <Select.Option key={subject?.subjectCode} value={subject?.subjectCode}
                                
                            >{getSubject(subject?.subjectCode)?.subjectName}</Select.Option>
                        ))
                        }
                    </Select>
                </div>
                <Card className={" "} >
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
                                                            <Typography style={{fontSize: "12px"}} className={""}>
                                                                {item.title}
                                                            </Typography>
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
                
            </Modal>
        </>
    )
}
export default TeacherTimelineModal