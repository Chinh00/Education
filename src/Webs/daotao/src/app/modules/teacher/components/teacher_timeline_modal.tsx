import React, {useEffect, useState} from "react";
import {Button, Drawer, Modal, Select, Tooltip, Typography, List, Spin} from "antd";
import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {GripVertical, Plus} from "lucide-react";
import {ScheduleItem} from "@/domain/schedule_item.ts";

import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {Eye, EyeOff} from "lucide-react"
import {IconButton} from "@mui/material";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {Staff} from "@/domain/staff.ts";
import {Query} from "@/infrastructure/query.ts";
import {Subject} from "@/domain/subject.ts";
export type TeacherTimelineModalProps = {
    staff?: Staff
}

const TeacherTimelineModal = ({staff}: TeacherTimelineModalProps) => {
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


    const [selectedCourseClassStage, setSelectedCourseClassStage] = useState(0)

    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string[]>([])

    
    const [queryCourseClasses, setQueryCourseClasses] = useState<Query>({
        Filters: [
            {
                field: "TeacherCode",
                operator: "==",
                value: staff?.code ?? ""
            },
            {
                field: "Stage",
                operator: "==",
                value: `${selectedCourseClassStage}`
            }

        ]
    })

    useEffect(() => {
        setQueryCourseClasses({
            Filters: [
                {
                    field: "TeacherCode",
                    operator: "==",
                    value: staff?.code ?? ""
                },
                {
                    field: "Stage",
                    operator: "==",
                    value: `${selectedCourseClassStage}`
                }
            ]
        })
    }, [selectedCourseClassStage]);
    
    
    const {data: courseClasses} = useGetCourseClasses(queryCourseClasses, staff !== undefined && openModel)

    const {data: timeline, isLoading: timelineLoading} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: courseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            }
        ],
        Page: 1,
        PageSize: 1000
    }, courseClasses !== undefined && courseClasses?.data?.data?.items?.length > 0 && openModel)

    useEffect(() => {
        if (courseClasses && courseClasses?.data?.data?.items?.length === 0) {
            setScheduledItems([])
        }
        if (courseClasses && courseClasses?.data?.data?.items?.length > 0) { 
            setSelectedSubjectCode(courseClasses?.data?.data?.items?.map(c => c.subjectCode) ?? [])
        }
    }, [courseClasses]);
    
    
    useEffect(() => {
        setScheduledItems([])
        if (timeline) {
            setScheduledItems(prevState => [
                ...prevState,
                ...timeline?.data?.data?.items?.filter(e => getCourseClassBySubjectCode([...selectedSubjectCode])?.includes(e?.courseClassCode))?.map(c => {
                    return {
                        id: c?.id,
                        title: `${c?.courseClassCode} (${getStage[courseClasses?.data?.data?.items?.find(cc => cc.courseClassCode === c?.courseClassCode)?.stage ?? 0]}) (P. ${c?.roomCode})`,
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
        setSelectedSubjectCode([])
    };
    const getSubjects = () => {
        const subjectOfTeacherStage: Record<string, Subject> = {};
        courseClasses?.data?.data?.items?.forEach((courseClass) => {
            if (courseClass.stage === selectedCourseClassStage) {
                const foundSubject = subjects?.data?.data?.items?.find(s => s.subjectCode === courseClass.subjectCode);
                if (foundSubject) {
                    subjectOfTeacherStage[courseClass.subjectCode] = foundSubject;
                }
            }
        });
        return Object.values(subjectOfTeacherStage);
    }
    const getSubjectCodeByCourseClassCode = (courseClassCode: string) => {
            return courseClasses?.data?.data?.items?.find(c => c.courseClassCode === courseClassCode)?.subjectCode;
    }
    
    const getCourseClassBySubjectCode = (subjectCodes: string[]) => {
        if (!subjectCodes || subjectCodes.length === 0) return null;
        return courseClasses?.data?.data?.items?.filter(c => subjectCodes.includes(c?.subjectCode))?.map(e => e?.courseClassCode) ?? [];
    }
    return (
        <>
            <Tooltip title={"Chi tiết thời khóa biểu"}><IconButton onClick={() => setOpenModel(true)}><Eye size={15} /></IconButton></Tooltip>
            
            <Drawer
                loading={timelineLoading}
                title={`Chi tiết thời khóa biểu của giảng viên: ${staff?.fullName ?? ""}`}
                open={openModel} width={"100%"} onClose={() => setOpenModel(false)}
                
            
            >
                <Spin spinning={timelineLoading} className={"w-full h-full"}>
                    <div className={"grid grid-cols-6 gap-5"}>
                        <div className={"col-span-1 flex flex-col gap-5"}>
                            <Select onChange={handleStageChange} defaultValue={0} className={"w-full"}>
                                <Select.Option value={0}>Giai đoạn 1</Select.Option>
                                <Select.Option value={1}>Giai đoạn 2</Select.Option>
                                <Select.Option value={2}>Cả 2 giai đoạn</Select.Option>
                            </Select>

                            <List
                                header={<div>Danh sách các môn</div>}
                                bordered
                                size={"small"}
                                dataSource={getSubjects()}
                                renderItem={(item) => (
                                    item ? (
                                        <List.Item key={item.id} className={"flex justify-between items-center"} >
                                            <Typography.Text >{item.subjectName}</Typography.Text>
                                            <Button icon={selectedSubjectCode?.includes(item?.subjectCode) ? <Eye size={18} /> : <EyeOff size={18} />} size={"small"} style={{border: "none"}}
                                                onClick={() => {
                                                    if (selectedSubjectCode.includes(item.subjectCode)) {
                                                        setSelectedSubjectCode(prev => prev.filter(c => c !== item.subjectCode))
                                                    } else {
                                                        setSelectedSubjectCode(prev => [...prev, item.subjectCode])
                                                    }
                                                    
                                                }}
                                            
                                            />
                                        </List.Item>
                                    ) : null
                                )}
                            />

                        </div>
                        <div className={"col-span-5 "}>
                            <Card className={""} >
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
                        </div>

                    </div>
                </Spin>
                
            </Drawer>
        </>
    )
}
export default TeacherTimelineModal