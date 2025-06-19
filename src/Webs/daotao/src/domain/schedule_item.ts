export interface ScheduleItem {
    id: string
    title: string
    subject: string
    color: string
    startSlot: number
    endSlot: number
    dayIndex: number
    duration: number,
    courseClassId?: string;
    roomCode?: string;
    courseClassCode?: string;
    teacherCode?: string,
    teacherName?: string
}
