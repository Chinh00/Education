import { SubjectResult } from "./subject_result.ts";

export interface HistorySemester {
    semesterCode: string;
    semesterName: string;
    educationStartDate: string;
    educationEndDate: string;
    startDate: string;
    endDate: string;
    subjectResults: SubjectResult[];
}
