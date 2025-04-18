export interface Subject {
    subjectName: string;
    subjectNameEng: string | null;
    subjectCode: string;
    subjectDescription: string | null;
    numberOfCredits: number;
    id: string;
    createdAt: string;
    updatedAt: string | null;
}