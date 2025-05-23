import {SubjectResult} from "@/domain/subject_result.ts";
import {CourseSubject} from "@/domain/course_subject.ts";

export interface StudentSemester {
    studentCode: string;
    semesterCode: string;
    semesterName: string;

    educationStartDate: string;

    educationEndDate: string;

    startDate: string;

    endDate: string;

    subjectResults: SubjectResult[];
    courseSubjects: CourseSubject[];
}
