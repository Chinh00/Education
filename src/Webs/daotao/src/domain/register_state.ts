export interface Register {
    id: string
    correlationId: string;
    eventStoreId: string;
    version: number;
    currentState: string;
    semesterCode: string | null;
    startDate: string;
    endDate: string;
    studentChangeStart: string;
    studentChangeEnd: string;
    educationStart: string;
    educationEnd: string;
    
    numberStudent: number;
    numberSubject: number;
    numberWish: number;
}

