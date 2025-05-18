import {SlotTimeline} from "@/domain/slot_timeline.ts";

export interface CourseClass {
    classIndex: number,
    courseClassCode: string,
    studentIds: string[],
    courseClassType: number,
    subjectCode: string,
    sessionLength: number,
    session: number,
    correctionId: string,
    durationInWeeks: number,
    minDaySpaceLesson: number,
    stage: number,
    id: string,
    createdAt: string,
    updatedAt: string | null,
}