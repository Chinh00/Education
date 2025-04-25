export interface RegisterState {
    correlationId: string;
    version: number;
    currentState: string;
    semesterCode: string | null;
    startDate: string;
    endDate: string;   // ISO 8601 format, e.g., "2025-04-25T11:57:00Z"
}
