export interface SubjectTimelineConfig {
    subjectCode: string;
    periodTotal: number;
    lectureTotal: number;
    lectureLesson: number;
    lecturePeriod: number;
    labTotal: number;
    labLesson: number;
    labPeriod: number;
    minDaySpaceLecture: number;
    minDaySpaceLab: number;
    lectureMinStudent: number;
    labMinStudent: number;
    lectureStartWeek: number,
    labStartWeek: number,
    stage: number,
    durationInWeeks: number
    id: string;
    createdAt: string;
    updatedAt: string | null;
}