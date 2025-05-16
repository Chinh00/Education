export interface Subject {
    subjectName: string;
    subjectNameEng: string;
    subjectCode: string;
    subjectDescription: string;
    numberOfCredits: number;
    departmentCode: string;
    defineCode: string | null;
    examTime: string | null;
    isCalculateMark: boolean;
    status: number;
    id: string;
    createdAt: string;   
    updatedAt: string | null;
}