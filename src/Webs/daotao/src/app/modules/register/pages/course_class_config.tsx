import React, {useEffect, useState} from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {ColumnsType, useGetRooms } from "../../common/hook"
import {Room} from "@/domain/room.ts";
import {Form, Input, Select, Table, Typography} from "antd"
import { Box } from "@mui/material"
import {Button as ButtonAntd} from "antd"
import {useParams} from "react-router";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {CourseClassModel, SlotTimelineModel} from "../../education/services/courseClass.service"
import {Controller, useForm} from "react-hook-form";
import FormInputAntd from "@/app/components/inputs/FormInputAntd"
import FormItem from "antd/es/form/FormItem";
import {useCreateCourseClass} from "@/app/modules/education/hooks/useCreateCourseClass.ts";
import toast from "react-hot-toast";
import {daysOfWeek, timeSlots } from "@/infrastructure/date"
import {useAppSelector} from "@/app/stores/hook.ts";
import { useGetSubjects } from "../../subject/hooks/hook"
import {getCourseClassType} from "@/app/modules/register/pages/course_class_list.tsx";
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



const CourseClassConfig = () => {
    const { subject, semester} = useParams()
    const {data} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject!
            }
        ]
    }, subject !== undefined)
    
    const subjectConfig = data?.data?.data?.items?.[0]
    const [selectedCourseClassStage, setSelectedCourseClassStage] = useState(0)
    
    const [courseClassType, setCourseClassType] = useState(0)
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])

    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [timelineCommit, setTimelineCommit] = useState<{schedule: SlotTimelineModel, id: string}[]>([])

    useEffect(() => {
        if (scheduledItems && scheduledItems?.length > 0) {
            setTimelineCommit(prevState => [
                ...prevState?.filter(c => !scheduledItems.map(e => e.id).includes(c.id)),
                ...scheduledItems.filter(c => c.id.startsWith("schedule")).map((item, index) => {
                    return {
                        schedule: {
                            dayOfWeek: item.dayIndex,
                            roomCode: selectedRoom,
                            slot: Array.from({length: 100}, (_, i) => i).slice(item.startSlot, item.startSlot + item.duration).map(c => `${c}`)
                        },
                        id: item.id
                    } as {schedule: SlotTimelineModel, id: string}
                })

            ])
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
            subject: courseClassType === 0 ? "Lý thuyết" : "Thực hành",
            color:
                courseClassType === 0
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

    const {data: rooms, isLoading: RoomLoadings} = useGetRooms({
        Filters: [
            {
                field: "SupportedConditions",
                operator: "ArrayContains",
                value: courseClassType === 0 ? subjectConfig?.lectureRequiredConditions.join(",")! : subjectConfig?.labRequiredConditions.join(",")!
            }
        ],
        Page: 1,
        PageSize: 1000
    }, subjectConfig !== undefined && (subjectConfig.lectureRequiredConditions?.length > 0 || subjectConfig?.labRequiredConditions?.length > 0))
    const columns: ColumnsType<Room> = [
        {
            title: 'Tên phòng ',
            dataIndex: "code",
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <ButtonAntd size={"small"} onClick={() => {
                    setSelectedRoom(record.code)

                    setScheduledItems([])
                }}>Chọn</ButtonAntd>
            ),
        },

    ];

    const tableColumns = columns.map((item) => ({ ...item }));
    const [selectedRoom, setSelectedRoom] = useState<string>()

    const {data: courseClass, refetch: courseClassRefetch} = useGetCourseClasses({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            },
            {
                field: "Stage",
                operator: "In",
                value: [selectedCourseClassStage, 2].join(",")
            },
            
        ]
    }, selectedRoom !== undefined)
    // dữ liệu thời khóa biểu của phòng

    const {data: timeLine, isLoading: timelineLoading} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: courseClass?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            },
            {
                field: "RoomCode",
                operator: "==",
                value: selectedRoom!
            }
        ]
    }, courseClass?.data?.data?.items?.length !== undefined && courseClass?.data?.data?.items?.length > 0 && selectedRoom !== undefined)

    useEffect(() => {
        if(timeLine !== undefined && timeLine?.data?.data?.items?.length > 0) {
            setScheduledItems(prevState => [
                ...prevState,
                ...timeLine?.data?.data?.items?.map(c => {
                    return {
                        id: c?.id,
                        title: `${c?.courseClassCode}`,
                        subject: "",
                        color: "bg-red-100 text-blue-800 border-blue-200",
                        startSlot: +c?.slots[0],
                        endSlot: +c?.slots[c.slots?.length - 1],
                        dayIndex: c?.dayOfWeek,
                        duration: c.slots?.length
                    } as unknown as ScheduleItem
                }) ?? []
            ])
        }
    }, [timeLine]);

    const {control, reset, getValues, setValue} = useForm<CourseClassModel>({
        defaultValues: {
            semesterCode: semester,
            subjectCode: subject,
            courseClassType: 0,
            stage: 0,
            weekStart: 0
        }
    } )
    const {mutate, isPending: createLoading} = useCreateCourseClass()
    const {data: courseClasses} = useGetCourseClasses({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject!
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            },
            {
                field: "CourseClassType",
                operator: "==",
                value: `${courseClassType!}`
            }
        ]
    }, subject !== undefined && semester !== undefined && courseClassType !== undefined)
    useEffect(() => {
        if (rooms !== undefined && selectedRoom && rooms?.data?.data?.items?.filter(e => e.code === selectedRoom).length > 0) {
            setValue("numberStudentsExpected", rooms?.data?.data?.items?.filter(e => e.code === selectedRoom)[0]?.capacity)
        }
    }, [selectedRoom, rooms]);
    
    useEffect(() => {
        if (courseClassType === 0) {
            setValue("courseClassCode", `${getValues("subjectCode")}_${getValues("semesterCode")}_Lecture_${(courseClasses?.data?.data?.totalItems ?? 0) + 1}`)
            setValue("courseClassName", `${getValues("subjectCode")}_${getValues("semesterCode")}_Lecture_${(courseClasses?.data?.data?.totalItems ?? 0) + 1}`)
        } else  {
            setValue("courseClassCode", `${getValues("subjectCode")}_${getValues("semesterCode")}_Lab_${(courseClasses?.data?.data?.totalItems ?? 0) + 1}`)
            setValue("courseClassName", `${getValues("subjectCode")}_${getValues("semesterCode")}_Lab_${(courseClasses?.data?.data?.totalItems ?? 0) + 1}`)
            
        }
    }, [courseClassType, courseClasses]);


    const {data: courseClassList, isLoading, isSuccess} = useGetCourseClasses({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject!
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            },
        ]
    }, semester !== undefined)
    
    
    return (
        <div className="space-y-6">
            <Card>
                <Form>
                    <CardContent className={"flex flex-col gap-3"} >
                        <FormInputAntd control={control} name={"subjectCode"} initialValue={subject} label={"Mã môn học"} />
                        <FormInputAntd control={control} name={"semesterCode"} initialValue={semester} label={"Mã kì học"} />
                        <Controller
                            name="courseClassCode"
                            control={control}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Mã lớp học</Typography>} help={"Mã lớp_Mã kì học_Loại lớp_STT lớp"} className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="courseClassName"
                            control={control}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Tên lớp học</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="numberStudentsExpected"
                            control={control}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số sinh viên</Typography>} help={"Mặc định là sức chứa phòng hoặc có thể điều chỉnh cho phù hợp"} className={"col-span-2"}>
                                    <Input  {...field} type={"number"}  />
                                </Form.Item>
                            )}
                        />
                        <FormItem label={"Loại lớp học"}>
                            <Select
                                showSearch
                                className={"w-full"} defaultValue={courseClassType} onChange={(e) => {
                                    setCourseClassType(e)
                                setValue("courseClassType", e)
                            }} >
                                <Select.Option value={0}>Lý thuyết</Select.Option>
                                <Select.Option value={1}
                                    disabled={subjectConfig?.labTotal === 0 || subjectConfig?.labRequiredConditions?.length === 0}
                                
                                >Thực hành</Select.Option>
                            </Select>
                        </FormItem>
                        
                        
                        <FormItem label={"Là lớp thành phần của"}>
                            <Select
                                showSearch
                                className={"w-full"} defaultValue={""} onChange={(e) => {
                                setValue("parentCourseClassCode", e)
                            }} >
                                <Select.Option value={""}>Là lớp chính</Select.Option>
                                {
                                    courseClassList && courseClassList?.data?.data?.items?.map((item) => (
                                        <Select.Option key={item.id} value={item.courseClassCode}>
                                            {item.courseClassName} ({getCourseClassType[item.courseClassType]})
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                        <FormItem label={"Giai đoạn học"}>
                            <Select
                                showSearch
                                className={"w-full"} defaultValue={0} onChange={(e) => {
                                    setSelectedCourseClassStage(e)
                                setValue("stage", e)
                            }} >
                                <Select.Option value={0}>Giai đoạn 1</Select.Option>
                                <Select.Option value={1}>Giai đoạn 2</Select.Option>
                                <Select.Option value={2}>Cả 2 giai đoạn</Select.Option>
                            </Select>
                        </FormItem>
                        
                        <FormItem label={"Tuần bắt đầu"}>
                            <Select className={"w-full"} defaultValue={courseClassType} onChange={(e) => {
                                setValue("weekStart", e)
                            }} >
                                <Select.Option value={0}>1</Select.Option>
                                <Select.Option value={1}>2</Select.Option>
                                <Select.Option value={2}>3</Select.Option>
                                <Select.Option value={3}>4</Select.Option>
                                <Select.Option value={4}>5</Select.Option>
                                <Select.Option value={5}>6</Select.Option>
                                <Select.Option value={6}>7</Select.Option>
                                <Select.Option value={7}>8</Select.Option>
                            </Select>
                        </FormItem>
                        
                    </CardContent>
                </Form>

            </Card>

            <div className="grid grid-cols-12 gap-6">
                <div className=" relative col-span-3 space-y-5">
                    <Card className={"relative  min-h-[450px]"}>
                        <Table<Room>
                            className={"absolute top-0 w-full p-5"}
                            rowKey={(c) => c.id}
                            loading={RoomLoadings}

                            showHeader={true}
                            title={() => <Box className={"flex text-gray-800 flex-row justify-between items-center p-[16px]  "}>
                                Đang chọn phòng {selectedRoom  ?? "Chưa chọn phòng"}
                            </Box>}
                            size={"small"}
                            bordered={true}
                            virtual
                            pagination={false}
                            columns={tableColumns}
                            dataSource={rooms?.data?.data?.items ?? []}
                            scroll={{
                                y: 350,
                                
                            }}

                        />
                    </Card>
                    <Card className="h-fit">
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-bold">Cấu hình lớp {courseClassType === 0 ? "Lý thuyết" : "Thực hành"}</h3>
                            <div className="space-y-2 text-sm">
                                <div>Phòng: {selectedRoom || "Chưa chọn"}</div>
                                <div>Số buổi đã tạo: {timelineCommit.length}</div>
                            </div>

                            {/* Scheduled Items List */}
                            {timelineCommit.length > 0 && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Buổi học đã lên lịch:</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {timelineCommit.map((item, ind) => (
                                            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                                                <div>
                                                    <div className="font-medium">Buổi {ind + 1}</div>
                                                    <div className="text-gray-500">
                                                        {daysOfWeek[item.schedule.dayOfWeek]} - Tiết {+item.schedule.slot[0] + 1}-{+item.schedule.slot[item.schedule.slot.length - 1] + 1}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteScheduleItem(item.id)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Schedule Grid */}
                <div className="col-span-9">
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

            {/* Save Button */}
            <div className="flex justify-end">
                <ButtonAntd type={"primary"} loading={createLoading}
                    onClick={() => {
                        mutate({
                            ...getValues(),
                            slotTimelines: timelineCommit.map(c => {
                                return c.schedule
                            })
                        }, {
                            onSuccess: () => {
                                toast.success("Lưu thành công")
                            }
                        })
                        console.log(getValues())
                    }}
                    disabled={timelineCommit.length === 0}
                >
                    Lưu lại
                </ButtonAntd>
            </div>
        </div>
    )
}

export default CourseClassConfig
