import { EducationSubject } from "./education_subject";

export interface Education {
    code: string;
    name: string;
    type: number;
    trainingTime: number;
    educationSubjects: string[];
    id: string;
    courseCode: string;
    createdAt: string;
    updatedAt: string | null;
    specialityCode: string;
}