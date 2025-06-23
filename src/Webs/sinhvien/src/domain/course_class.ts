import _ from "lodash";
export interface CourseClass {
    weekStart: number;
    status: number;
    courseClassCode: string;
    courseClassName: string;
    studentIds: string[];
    courseClassType: number;
    subjectCode: string;
    sessionLength: number;
    totalSession: number;
    session: number;
    semesterCode: string | null;
    numberStudents: number;
    numberStudentsExpected: number;
    stage: number;
    teacherName: string;
    teacherCode: string;
    parentCourseClassCode: string | null;
    id: string;
    createdAt: string; 
    updatedAt: string | null;
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
    startDate: string; 
    endDate: string;   
    semesterCode: string;
    numberStudentsExpected: number;
    students: string[]; 
    stage: number;
    parentCourseClassCode: string;
    weekStart: number;
    slotTimes: SlotTimeRegister[];
}




export function groupCourseClassesWithLodash(items: CourseClassRegister[]) {
    // Tách các lớp lý thuyết và các lớp lab
    const lectures = items.filter(c => c.courseClassType === 0);
    const labs = items.filter(c => c.courseClassType === 1);
    // Nhóm các lab theo parentCourseClassCode
    const labsGrouped = _.groupBy(labs, "parentCourseClassCode");

    // Gắn các lab vào các lớp lý thuyết tương ứng
    return lectures.map(lecture => ({
        ...lecture,
        children: labsGrouped[lecture.courseClassCode] || [],
    }));
}