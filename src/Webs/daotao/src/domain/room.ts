export interface Room {
    capacity: number;
    code: string;
    name: string;
    buildingCode: string;
    supportedConditions: string[];
    id: string;
    createdAt: string;
    updatedAt: string | null;
}