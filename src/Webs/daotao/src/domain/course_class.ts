
export interface CourseClass {
    courseClassCode: string,
    courseClassName: string,
    studentIds: string[],
    courseClassType: number,
    subjectCode: string,
    sessionLength: number,
    session: number,
    correctionId: string,
    durationInWeeks: number,
    minDaySpaceLesson: number,
    semesterCode: string,
    numberStudents: number,
    stage: number,
    id: string,
    createdAt: string,
    updatedAt: string | null,
    teacherCode: string,
    teacherName: string,
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
