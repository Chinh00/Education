import {useGetSemesters} from "@/app/modules/student/hooks/useGetSemester.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Fragment, useEffect, useState, useMemo} from "react";
import {Select} from "antd";
import {Box} from "@mui/material";
import {Query} from "@/infrastructure/query.ts";
import {useGetTimeline} from "@/app/modules/student/hooks/useGetTimeline.ts";
import {useGetCourseClasses} from "@/app/modules/student/hooks/useGetCourseClasses.ts";
import {weeksBetween} from "@/infrastructure/datetime_format.ts";
import {useGetStudentRegisterCourseClass} from "@/app/modules/student/hooks/useGetStudentRegisterCourseClass.ts";
import {useGetSubjects} from "@/app/modules/common/hook.ts";

interface ScheduleItem {
  id: string
  title: string
  subject: string
  color: string
  startSlot: number
  endSlot: number
  dayIndex: number
  duration: number,
  roomCode: string
}

export const timeSlots = [
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
];
export const daysOfWeek = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];

const StudentTimeline = () => {
  const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // --- Semester Data ---
  const {data, isLoading, isSuccess} = useGetSemesters({
    Filters: [
      {
        field: "SemesterStatus",
        operator: "In",
        value: "0,1"
      }
    ],
    Sorts: ["IdDesc"]
  });
  const getParentSemester = data?.data?.data?.items?.find(e => e?.parentSemesterCode === null || e?.parentSemesterCode === "");
  // --- Course class filter by week ---
  const {data: studentRegisters} = useGetStudentRegisterCourseClass();
  const courseClasses = useMemo(() => (
      studentRegisters?.data?.data?.courseClassCode?.filter(e => selectedWeek < 8 ? e?.includes("GD1") : e.includes("GD2")) ?? []
  ), [studentRegisters, selectedWeek]);

  // --- Course class & subject data ---
  const {data: courseClassesOrigin} = useGetCourseClasses({
    Filters: [
      {
        field: "CourseClassCode",
        operator: "In",
        value: courseClasses?.join(",") ?? ""
      },
    ]
  }, courseClasses?.length > 0);

  const {data: subjects } = useGetSubjects({
    Filters: [
      {
        field: "SubjectCode",
        operator: "In",
        value: courseClassesOrigin?.data?.data?.items?.map(e => e.subjectCode)?.join(",") ?? ""
      }
    ],
  }, courseClassesOrigin !== undefined && courseClassesOrigin?.data?.data?.items?.length > 0);


  const [timelineQuery, setTimelineQuery] = useState<Query>({});
  // Gộp tất cả logic cập nhật Filters vào 1 useEffect
  useEffect(() => {
    if (courseClasses.length > 0) {
      const filters = [
        {
          field: "CourseClassCode",
          operator: "In",
          value: courseClasses.join(",")
        }
      ];
      if (selectedWeek < 8) {
        filters.push({
          field: "StartWeek",
          operator: "<=",
          value: selectedWeek.toString()
        });
      }
      setTimelineQuery(prevState => {
        const isSame = JSON.stringify(prevState.Filters) === JSON.stringify(filters);
        if (isSame) return prevState;
        return { ...prevState, Filters: filters };
      });
    }
  }, [courseClasses, selectedWeek]);

  // --- Timeline Data ---
  const shouldFetch =
      !!timelineQuery.Filters?.find(e => e.field === "CourseClassCode") &&
      courseClasses.length > 0;
  const {data: timeLine, isLoading: timelineLoading} = useGetTimeline(
      timelineQuery,
      shouldFetch
  );

  // --- Scheduled Items ---
  useEffect(() => {
    if (selectedWeek === 8) {
      setScheduledItems([]);
      return;
    }
    if (subjects !== undefined && timeLine !== undefined && timeLine?.data?.data?.items?.length > 0) {
      const newItems: ScheduleItem[] = timeLine?.data?.data?.items?.map(c => {
        const courseClass = courseClassesOrigin?.data?.data?.items?.find(e => e.courseClassCode === c?.courseClassCode);
        const subject = subjects?.data?.data?.items?.find(e => e.subjectCode === courseClass?.subjectCode);
        return {
          id: c?.id,
          title: courseClass?.teacherName ?? "",
          subject: subject?.subjectName ?? "",
          color: "bg-red-100 text-blue-800 border-blue-200",
          startSlot: +c?.slots[0],
          endSlot: +c?.slots[c.slots?.length - 1],
          dayIndex: c?.dayOfWeek,
          duration: c.slots?.length,
          roomCode: c?.roomCode ?? "",
        };
      }) ?? [];
      setScheduledItems(newItems);
    }
  }, [timeLine, subjects, selectedWeek, courseClassesOrigin]);

  // --- Helpers ---
  const getItemAtSlot = (dayIndex: number, slotIndex: number) => {
    return scheduledItems.find(
        (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
    );
  };
  const isSlotOccupied = (dayIndex: number, slotIndex: number) => {
    return scheduledItems.some(
        (item) => item.dayIndex === dayIndex && slotIndex >= item.startSlot && slotIndex <= item.endSlot,
    );
  };

  // --- Weeks Array ---
  const weeks = useMemo(() =>
          Array.from(
              {length: weeksBetween(new Date(getParentSemester?.endDate ?? ""), new Date(getParentSemester?.startDate ?? ""), "ceil") ?? 0},
              (_, index) => index + 1
          ),
      [getParentSemester]
  );

  return (
      <PredataScreen isLoading={isLoading} isSuccess={isSuccess} >
        <Box className={"flex flex-col gap-10"}>
          <Select className={"w-[300px]"}
                  value={selectedWeek}
                  onChange={setSelectedWeek}
          >
            {weeks && weeks.map((week) => (
                <Select.Option key={week} value={week}>Tuần {week}</Select.Option>
            ))}
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
                    const isOccupied = isSlotOccupied(dayIndex, slotIndex);
                    const item = getItemAtSlot(dayIndex, slotIndex);
                    const isItemStart = item && item.startSlot === slotIndex;
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
                                <span className={"text-[10px]"}>GV: {item.title}</span>
                                <span className="text-xs opacity-75">P.{item.roomCode}</span>
                              </div>
                          )}
                        </div>
                    )
                  })}
                </Fragment>
            ))}

          </div>
        </Box>
      </PredataScreen>
  );
}

export default StudentTimeline;