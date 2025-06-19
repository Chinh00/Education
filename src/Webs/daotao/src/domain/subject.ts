export interface Subject {
    subjectName: string;
    subjectNameEng: string;
    subjectCode: string;
    subjectDescription: string | null;
    numberOfCredits: number;
    departmentCode: string;
    isCalculateMark: boolean;
    status: number;
    id: string;
    createdAt: string; // ISO date string
    updatedAt: string | null;

}