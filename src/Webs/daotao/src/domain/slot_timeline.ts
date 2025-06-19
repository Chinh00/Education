export interface SlotTimeline {
    courseClassCode: string,
    buildingCode: string,
    roomCode: string,
    dayOfWeek: number,
    slots: string[],
    startWeek: number,
    endWeek: number,
    id: string,
    createdAt: string,
    updatedAt: string | null
}
