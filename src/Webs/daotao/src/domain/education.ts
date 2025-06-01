
export interface Education {
    code: string;
    name: string;
    type: number;
    trainingTime: number;
    knowledgeBlockDescriptions: string | null;
    educationSubjects: string[];
    id: string;
    courseId: string;
    createdAt: string;
    updatedAt: string | null;
    specialityCode: string;
}