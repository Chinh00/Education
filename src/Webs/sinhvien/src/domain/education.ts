import { EducationSubject } from "./education_subject";

export interface Education {
    code: string;
    name: string;
    type: number;
    trainingTime: number;
    knowledgeBlockDescriptions: string | null;
    educationSubjects: EducationSubject[];
    id: string;
    courseCode: string;
    createdAt: string;
    updatedAt: string | null;
    specialityPath: string;
}