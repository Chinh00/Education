
import {EventReceiveArg} from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';
import { Card } from "@/app/components/ui/card"
import { GripVertical } from "lucide-react"
import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Fragment} from "react"
import {Table, Typography} from "antd";
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
    title: string
    subject: string
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

// Block đơn giản cho một môn học
const initialBlocks: ScheduleBlock[] = [
    {
        id: "math-1",
        title: "Toán (1 tiết)",
        subject: "Toán",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        duration: 1,
    },
    {
        id: "math-2",
        title: "Toán (2 tiết)",
        subject: "Toán",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        duration: 2,
    },
    {
        id: "math-3",
        title: "Toán (3 tiết)",
        subject: "Toán",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        duration: 3,
    },
]

const CourseClassConfig = () => {
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])
    const [availableBlocks, setAvailableBlocks] = useState<ScheduleBlock[]>(initialBlocks)
    const [draggedItem, setDraggedItem] = useState<any>(null)
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null)
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null)

    const {semester, subject, classCode} = useParams()

    useEffect(() => {
        setScheduledItems(prevState => [...prevState, {
            id: "string",
            title: "string",
            subject: "string",
            color: "bg-red-100",
            startSlot: 6,
            endSlot: 9,
            dayIndex: 5,
            duration: 6
        }])
    }, []);
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
            title: draggedItem.title,
            subject: draggedItem.subject,
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


    const {data: subjectTimelineConfig} = useGetSubjectTimelineConfig(subject!, subject !== undefined)
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

    const {data: timeLine} = useGetTimeline({
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
                <Button size={"small"} onClick={() => setSelectedRoom(record.code)}>Chọn</Button>
            ),
        },

    ];

    const tableColumns = columns.map((item) => ({ ...item }));





    return (
        <PredataScreen isLoading={false} isSuccess={true}>

            <div>
                Thông tin lớp học

            </div>
            <Typography.Title level={4} className={"text-center"}>Thời khóa biểu</Typography.Title>
            <Divider />
            <div className={"grid grid-cols-6 gap-5 mt-5"}>
                <div className={"col-span-2"}>
                    <div className="col-span-2 p-4 border border-gray-400 rounded min-h-[500px]">
                        <p className="font-bold mb-4">Cấu hình</p>
                        <p className="">Phòng đang chọn: {selectedRoom ? selectedRoom : "Chưa chọn phòng nào"}</p>

                        <div>Buổi học trên tuần: </div>

                        <p className="font-bold mb-4">Số buổi trong tuần:</p>

                        <div
                            className="space-y-2 p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px]"
                            onDragOver={handleDragOver}
                            onDrop={handleDropToAvailable}
                        >
                            {availableBlocks.map((block) => (
                                <div
                                    key={block.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, block, "available")}
                                    className={`${block.color} px-3 py-2 rounded-md border cursor-move flex items-center justify-between hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
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
                            <div className="grid grid-cols-8 gap-0 schedule-grid">
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
                            </div>
                        </Card>
                    </div>

                </div>

            </div>
        </PredataScreen>
    )
}
export default CourseClassConfig
