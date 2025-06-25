import {SubjectResult} from "@/domain/subject_result.ts";

export interface StudentSemester {
    studentCode: string;
    semesterCode: string;

    subjectResults: SubjectResult[];
    courseSubjects: string[];
}
