import { SlotTimeRegister } from "./course_class";

export interface SlotTimeline {
    courseClassCode: string;
    buildingCode: string;
    roomCode: string;
    dayOfWeek: number;
    slots: string[]; 
    id: string;
    createdAt: string; 
    updatedAt: string | null;
}
function hasIntersection<T>(a: T[], b: T[]): boolean {
    return a.some(item => b.includes(item));
}

export function isTrungLich(slotRegister: SlotTimeRegister, slotTimeline: SlotTimeline): boolean {
    if (slotRegister.dayOfWeek !== slotTimeline.dayOfWeek) return false;
    if (
        slotRegister.buildingCode !== slotTimeline.buildingCode ||
        slotRegister.roomCode !== slotTimeline.roomCode
    ) return false;
    if (!hasIntersection(slotRegister.slot, slotTimeline.slots)) return false;
    return true;
}

export function checkTrungLichWithAll(
    slotRegisters: SlotTimeRegister[],
    timelines: SlotTimeline[]
): boolean {
    return slotRegisters.some(slotRegister =>
        timelines.some(slotTimeline => isTrungLich(slotRegister, slotTimeline))
    );
}