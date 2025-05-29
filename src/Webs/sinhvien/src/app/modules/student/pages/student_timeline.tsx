import {useGetSemesters} from "@/app/modules/student/hooks/useGetSemester.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Fragment, useEffect, useState} from "react";
import { Select, Spin } from "antd";
import {Box} from "@mui/material";
import {Query} from "@/infrastructure/query.ts";
import useGetStudentSemesters from "@/app/modules/student/hooks/useGetStudentSemesters.ts";
import { GripVertical } from "lucide-react";
import {useGetTimeline} from "@/app/modules/student/hooks/useGetTimeline.ts";
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
const StudentTimeline = () => {
  const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([])

  const getItemAtSlot = (dayIndex: number, slotIndex: number) => {
    return scheduledItems.find(
        (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
    )
  }
  const isSlotOccupied = (dayIndex: number, slotIndex: number) => {
    return scheduledItems.some(
        (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
    )
  }
  const timeSlots = [
    { id: "slot-1", period: "Tiết 1", time: "(07:00→07:50)" },
    { id: "slot-2", period: "Tiết 2", time: "(07:55→08:45)" },
    { id: "slot-3", period: "Tiết 3", time: "(08:50→09:40)" },
    { id: "slot-4", period: "Tiết 4", time: "(09:45→10:35)" },
    { id: "slot-5", period: "Tiết 5", time: "(10:40→11:30)" },
    { id: "slot-6", period: "Tiết 6", time: "(11:35→12:25)" },
    { id: "slot-7", period: "Tiết 7", time: "(12:55→13:40)" },
    { id: "slot-8", period: "Tiết 8", time: "(13:50→14:40)" },
    { id: "slot-9", period: "Tiết 9", time: "(14:45→15:35)" },
    { id: "slot-10", period: "Tiết 10", time: "(15:40→16:30)" },
    { id: "slot-11", period: "Tiết 11", time: "(16:35→17:25)" },
    { id: "slot-12", period: "Tiết 12", time: "(17:30→18:20)" },
    { id: "slot-13", period: "Tiết 13", time: "(18:50→19:40)" },
    { id: "slot-14", period: "Tiết 14", time: "(19:45→20:35)" },
    { id: "slot-15", period: "Tiết 15", time: "(20:40→21:30)" },
  ]
  const daysOfWeek = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"]

  const {data, isLoading, isSuccess} = useGetSemesters({
    Sorts: ["IdDesc"]
  })
  const [semesterSelect, setSemesterSelect] = useState<string>()
  const [query, setQuery] = useState<Query>({
  })

  useEffect(() => {
      if (semesterSelect !== undefined) {
        setQuery(prevState => ({
          ...prevState,
          Filters: [
              ...prevState?.Filters?.filter(c => c.field !== "SemesterCode") ?? [],
            {
              field: "SemesterCode",
              value: semesterSelect!,
              operator: "=="
            }
          ],
          Includes: ["CourseSubjects"]
        }))
        setScheduledItems([])
      }
  }, [semesterSelect]);

  const {data: courseClass, isLoading: courseLoading} = useGetStudentSemesters(query, semesterSelect !== undefined && query?.Filters?.filter(c => c.field !== "SemesterCode") !== undefined)

  const {data: timeLine, isLoading: timelineLoading} = useGetTimeline({
    Filters: [
      {
        field: "CourseClassCode",
        operator: "In",
        value: courseClass?.data?.data?.items[0]?.courseSubjects.map(c => c.courseClassCode)?.join(",")!
      },

    ]
  }, courseClass?.data?.data?.items?.length !== undefined && courseClass?.data?.data?.items?.length > 0 )

  useEffect(() => {
    if(timeLine !== undefined && timeLine?.data?.data?.items?.length > 0) {
      setScheduledItems(prevState => [
        ...prevState,
        ...timeLine?.data?.data?.items?.map(c => {
          return {
            id: c?.id,
            title: "",
            subject: courseClass?.data?.data?.items[0]?.courseSubjects?.filter(e => e.courseClassCode === c?.courseClassCode)[0]?.subjectName,
            color: "bg-red-100 text-blue-800 border-blue-200",
            startSlot: +c?.slots[0],
            endSlot: +c?.slots[c.slots?.length - 1],
            dayIndex: c?.dayOfWeek - 1,
            duration: c.slots?.length
          } as unknown as ScheduleItem
        }) ?? []
      ])
    }
  }, [timeLine]);
  return (
    <PredataScreen isLoading={isLoading} isSuccess={isSuccess} >
      <Box className={"space-y-10"}>
        <Select
            loading={isLoading}
            style={{
              minWidth: 350
            }}
            onChange={(value, option) => {
                setSemesterSelect(value)
            }}

            placeholder={"Chọn kì học"}
        >
          {!!data && data?.data?.data?.items?.map(c => {
            return <Select.Option value={c?.semesterCode} key={c?.semesterCode}>{c?.semesterName}</Select.Option>
          })}
        </Select>
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

                  return (
                      <div
                          key={`${dayIndex}-${slotIndex}`}
                          className={`p-2 border-b border-r min-h-[60px] transition-colors relative bg-gray-50"
                          }`}
                      >
                        {isOccupied && isItemStart && item && (
                            <div
                                className={`${item.color} px-2 py-1 rounded text-sm font-medium cursor-move flex flex-col gap-1 hover:shadow-md transition-shadow absolute inset-2`}
                                style={{
                                  height: `${(item.endSlot - item.startSlot + 1) * 58}px`,
                                  zIndex: 10,
                                }}
                            >
                              <span className={"text-[10px]"}>{item.subject}</span>
                              <span className="text-xs opacity-75">{item.duration} tiết</span>
                            </div>
                        )}


                      </div>
                  )
                })}
              </Fragment>
          ))}
          {
              courseLoading || timelineLoading && <div className={"absolute top-0 left-0 w-full h-full flex justify-center items-center"}>
                <Spin size={"large"} />
              </div>
          }
        </div>
      </Box>
    </PredataScreen>
  )
}

export default StudentTimeline
