export interface SubjectScheduleConfig {
    subjectCode: string;
    semesterCode: string;
    totalTheoryCourseClass: number;
    stage: number;
    theoryTotalPeriod: number;
    practiceTotalPeriod: number;
    theorySessions: number[];
    practiceSessions: number[];
    weekLectureStart: number;
    weekLectureEnd: number;
    weekLabStart: number;
    weekLabEnd: number;
    sessionPriority: number;
    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
    id: string;
    createdAt: string; 
    updatedAt: string | null;
}
