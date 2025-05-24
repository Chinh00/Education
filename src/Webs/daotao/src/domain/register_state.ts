export interface Register {
    id: string
    correlationId: string;
    version: number;
    currentState: string;
    semesterCode: string | null;
    startDate: string;
    endDate: string;
}

export interface RegisterState {
    id: string
    correlationId: string;
    version: number;
    currentState: string;
    semesterCode: string | null;
    startDate: string;
    endDate: string;
    numberStudent: number;
    numberSubject: number;
    numberWish: number;
}
