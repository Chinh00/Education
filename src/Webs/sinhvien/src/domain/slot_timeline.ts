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
