import { SubjectResult } from "./subject_result.model";

export interface HistorySemester {
    semesterCode: string;
    semesterName: string;
    educationStartDate: string;
    educationEndDate: string;
    startDate: string;
    endDate: string;
    subjectResults: SubjectResult[];
}
