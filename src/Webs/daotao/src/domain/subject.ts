export interface Subject {
    subjectName: string;
    subjectNameEng: string;
    subjectCode: string;
    subjectDescription: string ;
    numberOfCredits: number;
    departmentCode: string;
    isCalculateMark: boolean | null;
    status: number;

    lectureTotal: number;
    lectureLesson: number;
    lecturePeriod: number;

    labTotal: number;
    labLesson: number;
    labPeriod: number;

    lectureRequiredConditions: string[];
    labRequiredConditions: string[];

    lectureStartWeek: number;
    labStartWeek: number;

    id: string;
    createdAt: string; 
    updatedAt: string | null;
}