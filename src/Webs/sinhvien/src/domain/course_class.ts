
export interface CourseClass {
    classIndex: number,
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
    updatedAt: string | null
}

export interface SlotTimeRegister {
    buildingCode: string;
    roomCode: string;
    dayOfWeek: number;
    slot: string[];
}

export interface CourseClassRegister {
    courseClassCode: string;
    courseClassName: string;
    courseClassType: number;
    subjectCode: string;
    subjectName: string;
    numberOfCredits: number;
    teacherCode: string;
    teacherName: string;
    semesterCode: string;
    students: string[] | null;
    stage: number;
    slotTimes: SlotTimeRegister[];
}
