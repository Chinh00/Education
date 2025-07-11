
export interface CourseClass {
    index: number;
    weekStart: number;
    weekEnd: number;
    status: number;
    courseClassCode: string;
    courseClassName: string;
    studentIds: string[];
    courseClassType: number;
    subjectCode: string;
    sessionLengths: number[];
    totalSession: number;
    semesterCode: string | null;
    numberStudents: number;
    numberStudentsExpected: number;
    stage: number;
    teacherName: string | null;
    teacherCode: string | null;
    parentCourseClassCode: string;
    id: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface SlotTimeRegister {
    BuildingCode: string;
    RoomCode: string;
    DayOfWeek: number;
    Slot: string[]; 
}

export interface CourseClassRegister {
    CourseClassCode: string;
    CourseClassName: string;
    CourseClassType: number;
    SubjectCode: string;
    SubjectName: string;
    NumberOfCredits: number;
    TeacherCode: string;
    TeacherName: string;
    SemesterCode: string;
    Students: string[] | null;
    Stage: number;
    SlotTimes: SlotTimeRegister[];
}
