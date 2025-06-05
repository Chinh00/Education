export interface Subject {
    subjectName: string;
    subjectNameEng: string;
    subjectCode: string;
    subjectDescription: string | null;
    numberOfCredits: number;
    departmentCode: string;
    isCalculateMark: boolean;
    status: number;
    lectureTotal: number;
    lectureLesson: number;
    lecturePeriod: number;
    labTotal: number;
    labLesson: number;
    labPeriod: number;
    lectureRequiredConditions: string[]
    labRequiredConditions: string[];   
    id: string;
    createdAt: string;
    updatedAt: string | null; 
}