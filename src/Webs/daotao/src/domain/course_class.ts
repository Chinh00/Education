import {SlotTimeline} from "@/domain/slot_timeline.ts";

export interface CourseClass {
    classIndex: number;
    studentIds: string[] | null;
    courseClassType: number;
    subjectCode: string;
    sessionLength: number;
    correctionId: string;
    slotTimelines: SlotTimeline[];
    roomCode: string;
    buildingCode: string;
    session: number;
    durationInWeeks: number;
    id: string;
    createdAt: string;
    updatedAt: string | null;
}