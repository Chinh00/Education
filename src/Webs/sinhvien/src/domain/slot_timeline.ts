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

export function isTrungLich(courseClassCodeOfSlotRegister: string,  slotRegister: SlotTimeRegister, slotTimeline: SlotTimeline): boolean {
    if (slotRegister.dayOfWeek !== slotTimeline.dayOfWeek) return false;
    const gd1 = courseClassCodeOfSlotRegister.match(/GD\d/)?.[0];
    const gd2 = slotTimeline.courseClassCode?.match(/GD\d/)?.[0];

    if (gd1 !== gd2) return false;

    if (
        slotRegister.buildingCode !== slotTimeline.buildingCode ||
        slotRegister.roomCode !== slotTimeline.roomCode
    ) return false;
    if (!hasIntersection(slotRegister.slot, slotTimeline.slots)) return false;
    return true;
}

export function checkTrungLichWithAll(courseClassCodeOfSlotRegister: string,
    slotRegisters: SlotTimeRegister[],
    timelines: SlotTimeline[]
): boolean {
    return slotRegisters.some(slotRegister =>
        timelines.some(slotTimeline => isTrungLich(courseClassCodeOfSlotRegister, slotRegister, slotTimeline))
    );
}

export function getFirstTrungLichTimeline(courseClassCodeOfSlotRegister: string,
    slotRegisters: SlotTimeRegister[],
    timelines: SlotTimeline[]
): SlotTimeline | null {
    for (const slotTimeline of timelines) {
        for (const slotRegister of slotRegisters) {
            if (isTrungLich(courseClassCodeOfSlotRegister, slotRegister, slotTimeline)) {
                return slotTimeline;
            }
        }
    }
    return null;
}