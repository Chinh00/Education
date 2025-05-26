
import {EventReceiveArg} from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';
import {Card, CardContent} from "@/app/components/ui/card"
import { GripVertical } from "lucide-react"
import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Fragment} from "react"
import {Form, Select, Spin, Table, Typography} from "antd";
import {Box, Button, Divider} from "@mui/material";
import {useParams} from "react-router";
import {useGetSubjectTimelineConfig} from "@/app/modules/education/hooks/useGetSubjectTimelineConfig.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {ColumnsType, useGetRooms} from "@/app/modules/common/hook.ts";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {HistoryModal} from "@/app/components/modals/history_modal.tsx";
import {Room} from "@/domain/room.ts";
import SemesterModal from "@/app/modules/education/components/semester_modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {CourseClassModel, SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import FormItem from "antd/es/form/FormItem";
import {useCreateCourseClass} from "@/app/modules/education/hooks/useCreateCourseClass.ts";
import toast from "react-hot-toast";
interface ScheduleItem {
    id: string
    title: string
    subject: string
    color: string
    startSlot: number
    endSlot: number
    dayIndex: number
    duration: number
}

interface ScheduleBlock {
    id: string
    color: string
    duration: number
}
const timeSlots = [
    { id: "slot-1", period: "Tiết 1", time: "(07:00→07:45)" },
    { id: "slot-2", period: "Tiết 2", time: "(07:45→08:30)" },
    { id: "slot-3", period: "Tiết 3", time: "(08:45→09:30)" },
    { id: "slot-4", period: "Tiết 4", time: "(09:30→10:15)" },
    { id: "slot-5", period: "Tiết 5", time: "(10:30→11:15)" },
    { id: "slot-6", period: "Tiết 6", time: "(11:15→12:00)" },
    { id: "slot-7", period: "Tiết 7", time: "(12:30→13:15)" },
    { id: "slot-8", period: "Tiết 8", time: "(13:15→14:00)" },
    { id: "slot-9", period: "Tiết 9", time: "(14:15→15:00)" },
    { id: "slot-10", period: "Tiết 10", time: "(15:00→15:45)" },
]

const daysOfWeek = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"]




const CourseClassConfig = () => {
    const {semester, subject, classCode} = useParams()
    const [courseClassType, setCourseClassType] = useState(0)
    const {data: subjectTimelineConfig} = useGetSubjectTimelineConfig(subject!, subject !== undefined)
    const scheduleBlock = Array.from({ length: (courseClassType === 0 ? (subjectTimelineConfig?.data?.data?.lectureLesson ?? 0) :  (subjectTimelineConfig?.data?.data?.labLesson ?? 0)) }, (_, i) => i + 1).map(c => {
        return {
            id: `${c + 1}`,
            color: "bg-blue-100 text-blue-800 border-blue-200",
            duration: courseClassType === 0 ? (subjectTimelineConfig?.data?.data?.lecturePeriod ?? 0) :  (subjectTimelineConfig?.data?.data?.labPeriod ?? 0),
        } as ScheduleBlock
    } )
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])
    const [availableBlocks, setAvailableBlocks] = useState<ScheduleBlock[]>(scheduleBlock)
    const [draggedItem, setDraggedItem] = useState<any>(null)
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)


    const {mutate, isPending: createLoading} = useCreateCourseClass()
    const handleDragStart = (e: React.DragEvent, item: any, from: string) => {
        setDraggedItem(item)
        setDraggedFrom(from)
        e.dataTransfer.effectAllowed = "move"
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

    const handleDrop = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault()

        if (!draggedItem || !draggedFrom) return

        const endSlot = slotIndex + draggedItem.duration - 1

        if (endSlot >= timeSlots.length) {
            setDragPreview(null)
            setDraggedItem(null)
            setDraggedFrom(null)
            return
        }

        // Kiểm tra xung đột
        const hasConflict = scheduledItems.some(
            (item) =>
                item.dayIndex === dayIndex &&
                item.id !== draggedItem.id &&
                !(item.endSlot < slotIndex || item.startSlot > endSlot),
        )

        if (hasConflict) {
            setDragPreview(null)
            setDraggedItem(null)
            setDraggedFrom(null)
            return
        }

        let newScheduledItems = [...scheduledItems]
        let newAvailableBlocks = [...availableBlocks]

        if (draggedFrom === "available") {
            newAvailableBlocks = newAvailableBlocks.filter((item) => item.id !== draggedItem.id)
        } else {
            newScheduledItems = newScheduledItems.filter((item) => item.id !== draggedItem.id)
        }

        const newScheduledItem: ScheduleItem = {
            id: draggedItem.id,
            title: draggedItem.title,
            subject: draggedItem.subject,
            color: draggedItem.color,
            startSlot: slotIndex,
            endSlot: endSlot,
            dayIndex: dayIndex,
            duration: draggedItem.duration,
        }

        newScheduledItems.push(newScheduledItem)
        setTimeline(prevState => [
            ...prevState,
            {
                schedule: {
                    dayOfWeek: dayIndex,
                    roomCode: selectedRoom,
                    slot: Array.from({length: 100}, (_, i) => i).slice(slotIndex, slotIndex + draggedItem.duration).map(c => `${c}`)
                },
                id: draggedItem.id
            } as {schedule: SlotTimelineModel, id: string}
        ])

        setScheduledItems(newScheduledItems)
        setAvailableBlocks(newAvailableBlocks)
        setDragPreview(null)
        setDraggedItem(null)
        setDraggedFrom(null)
    }

    const handleDropToAvailable = (e: React.DragEvent) => {
        e.preventDefault()

        if (!draggedItem || draggedFrom === "available") return

        const newScheduledItems = scheduledItems.filter((item) => item.id !== draggedItem.id)
        const newAvailableBlock: ScheduleBlock = {
            id: draggedItem.id,
            color: draggedItem.color,
            duration: draggedItem.duration,
        }

        setScheduledItems(newScheduledItems)
        setAvailableBlocks((prev) => [...prev, newAvailableBlock])
        setDraggedItem(null)
        setDraggedFrom(null)
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

    const isPreviewSlot = (dayIndex: number, slotIndex: number) => {
        return (
            dragPreview &&
            dragPreview.dayIndex === dayIndex &&
            slotIndex >= dragPreview.startSlot &&
            slotIndex <= dragPreview.endSlot
        )
    }


    const [selectedRoom, setSelectedRoom] = useState<string>()

    const {data: courseClass} = useGetCourseClasses({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            }
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
                        title: "",
                        subject: "Đã có tiết",
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

    const {data: rooms, isLoading: RoomLoadings} = useGetRooms({
        Page: 1,
        PageSize: 1000
    })
    const columns: ColumnsType<Room> = [
        {
            title: 'Tên phòng ',
            dataIndex: "code",
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button size={"small"} onClick={() => {
                    setSelectedRoom(record.code)

                    setScheduledItems([])



                }}>Chọn</Button>
            ),
        },

    ];

    const tableColumns = columns.map((item) => ({ ...item }));


    const {control, reset, getValues, setValue} = useForm<CourseClassModel>({
        defaultValues: {
            semesterCode: semester,
            subjectCode: subject,
            courseClassType: 0
        }
    } )


    const [timeline, setTimeline] = useState<{schedule: SlotTimelineModel, id: string}[]>([])


    return (
        <PredataScreen isLoading={false} isSuccess={true}>

            <Card>
                <Form>
                    <CardContent >
                        <FormInputAntd control={control} name={"subjectCode"} initialValue={subject} label={"Mã môn học"} />
                        <FormInputAntd control={control} name={"semesterCode"} initialValue={semester} label={"Mã kì học"} />
                        <FormInputAntd control={control} name={"courseClassName"} initialValue={""} label={"Tên lớp học"} />
                        <FormInputAntd control={control} name={"courseClassCode"} initialValue={""} label={"Mã lớp học"} />
                        <FormItem label={"Loại lớp"}>
                            <Select className={"w-full"} defaultValue={courseClassType} onChange={(e) => {
                                setCourseClassType(e)
                                setValue("courseClassType", e)
                            }} >
                                <Select.Option value={0}>Lý thuyết</Select.Option>
                                <Select.Option value={1} disabled={subjectTimelineConfig?.data?.data?.labTotal === 0}>Thực hành</Select.Option>
                            </Select>
                        </FormItem>
                    </CardContent>
                </Form>

            </Card>
            <Typography.Title level={4} className={"text-center"}>Thời khóa biểu</Typography.Title>
            <Divider />
            <div className={"grid grid-cols-6 gap-5 mt-5"}>
                <div className={"col-span-2"}>
                    <div className="col-span-2 p-4 border border-gray-400 rounded min-h-[500px]">
                        <p className="font-bold mb-4">Cấu hình cho lớp {courseClassType === 0 ? "Lý thuyết" : "Thực hành"}</p>
                        <p className="">Phòng đang chọn: {selectedRoom ? selectedRoom : "Chưa chọn phòng nào"}</p>

                        <div>Tổng số tiết: {courseClassType === 0 ? subjectTimelineConfig?.data?.data?.lectureTotal: subjectTimelineConfig?.data?.data?.labTotal}  </div>
                        <div>Buổi học trên tuần: {courseClassType === 0 ? subjectTimelineConfig?.data?.data?.lectureLesson: subjectTimelineConfig?.data?.data?.labLesson}  </div>
                        <div>Số tiết mỗi buổi: {courseClassType === 0 ? subjectTimelineConfig?.data?.data?.lecturePeriod: subjectTimelineConfig?.data?.data?.labPeriod}  </div>


                        <div
                            className="space-y-2 p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px]"
                            onDragOver={handleDragOver}
                            onDrop={handleDropToAvailable}
                        >
                            {scheduleBlock.map((block) => (
                                <div
                                    key={block.id}
                                    draggable={selectedRoom !== undefined}
                                    onDragStart={(e) => handleDragStart(e, block, "available")}
                                    className={`${block.color} px-3 py-2 rounded-md border cursor-move flex items-center justify-between hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
                                    {timeline?.filter(c => c.id === block.id).length > 0 && (
                                        <div className={"text-sm whitespace-nowrap"}>Phòng {timeline?.filter(c => c.id === block.id)[0]?.schedule?.roomCode} - Thứ {timeline?.filter(c => c.id === block.id)[0]?.schedule?.dayOfWeek} - Tiết 4, 5, 6</div>
                                    )}

                                    <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">{block.duration} tiết</span>
                                </div>
                            ))}
                        </div>

                        <Table<Room>
                            rowKey={(c) => c.id}
                            loading={RoomLoadings}
                            style={{
                                height: "500px",
                            }}
                            showHeader={true}
                            title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                            </Box>}
                            size={"small"}
                            bordered={true}
                            virtual
                            pagination={false}
                            columns={tableColumns}
                            dataSource={rooms?.data?.data?.items ?? []}
                            scroll={{
                                y: 300, x: 100
                            }}

                        />
                    </div>

                </div>
                <div className={"col-span-4"}>
                    <div className="col-span-4">
                        <Card className="overflow-hidden">
                            <div className="grid grid-cols-8 gap-0 schedule-grid relative">
                                {/* Header */}
                                <div className="bg-gray-50 p-3 border-b border-r font-medium text-center">Tiết học</div>
                                {daysOfWeek.map((day) => (
                                    <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center">
                                        {day}
                                    </div>
                                ))}

                                {/* Time slots */}
                                {timeSlots.map((slot, slotIndex) => (
                                    <Fragment key={slot.id}>
                                        <div className="p-3 border-b border-r bg-gray-50">
                                            <div className="text-sm font-medium">{slot.period}</div>
                                            <div className="text-xs text-gray-500">{slot.time}</div>
                                        </div>

                                        {daysOfWeek.map((day, dayIndex) => {
                                            const isOccupied = isSlotOccupied(dayIndex, slotIndex)
                                            const item = getItemAtSlot(dayIndex, slotIndex)
                                            const isItemStart = item && item.startSlot === slotIndex
                                            const isPreview = isPreviewSlot(dayIndex, slotIndex)

                                            return (
                                                <div
                                                    key={`${dayIndex}-${slotIndex}`}
                                                    className={`p-2 border-b border-r min-h-[60px] transition-colors relative ${
                                                        isPreview ? "bg-blue-100 border-blue-300" : "hover:bg-gray-50"
                                                    }`}
                                                    onDragOver={(e) => handleCellDragOver(e, dayIndex, slotIndex)}
                                                    onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
                                                >
                                                    {isOccupied && isItemStart && item && (
                                                        <div
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, item, "scheduled")}
                                                            className={`${item.color} px-2 py-1 rounded text-sm font-medium cursor-move flex flex-col gap-1 hover:shadow-md transition-shadow absolute inset-2`}
                                                            style={{
                                                                height: `${(item.endSlot - item.startSlot + 1) * 58}px`,
                                                                zIndex: 10,
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <GripVertical className="w-3 h-3" />
                                                                <span>{item.subject}</span>
                                                            </div>
                                                            <span className="text-xs opacity-75">{item.duration} tiết</span>
                                                        </div>
                                                    )}

                                                    {isPreview && (
                                                        <div className="absolute inset-2 bg-blue-200 border-2 border-dashed border-blue-400 rounded flex items-center justify-center">
                            <span className="text-blue-700 text-xs font-medium">
                              {dragPreview && dragPreview.endSlot - dragPreview.startSlot + 1} tiết
                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </Fragment>
                                ))}
                                {
                                    timelineLoading && <div className={"absolute top-0 left-0 w-full h-full flex justify-center items-center"}>
                                        <Spin size={"large"} />
                                    </div>
                                }
                            </div>
                        </Card>
                    </div>

                </div>

            </div>
            <div className={"py-10 float-right"}><Button variant={"contained"} size={"small"} onClick={() => {


                mutate({
                    ...getValues(),
                    slotTimelines: timeline.map(c => {
                        return c.schedule
                    })
                }, {
                    onSuccess: () => {
                        toast.success("Thành công")
                    }
                })
            }}>Lưu lại</Button></div>
        </PredataScreen>
    )
}
export default CourseClassConfig
