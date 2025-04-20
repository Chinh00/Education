import {Semesterclass} from "@/domain/semester_class.ts";

export interface ClassManager {
    classCode: string;
    className: string;
    educationCode: string;
    semesterClasses: Semesterclass[];
    id: string;
    createdAt: string; 
    updatedAt: string | null;
}

