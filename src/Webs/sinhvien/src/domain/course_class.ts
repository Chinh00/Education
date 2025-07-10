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
    weekStart: number,
    weekEnd: number;
}

export interface CourseClassRegister {
    courseClassCode: string;
    isConflict: boolean
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




function isSlotTimeConflict(a: SlotTimeRegister, b: SlotTimeRegister): boolean {
    if (
        a.buildingCode !== b.buildingCode ||
        a.roomCode !== b.roomCode ||
        a.dayOfWeek !== b.dayOfWeek
    ) return false;

    // Kiểm tra giao ca học
    const slotOverlap = a.slot.some(slotA => b.slot.includes(slotA));
    if (!slotOverlap) return false;

    // Kiểm tra giao tuần học
    const weekOverlap = !(a.weekEnd < b.weekStart || a.weekStart > b.weekEnd);
    return weekOverlap;
}

/**
 * Đánh dấu các lớp bị trùng lịch với lớp đã đăng ký (theo slotTimes).
 */
function markConflictCourseClasses(
    items: CourseClassRegister[],
    exitCourseClasses: CourseClassRegister[]
): CourseClassRegister[] {
    return items.map(item => {
        const isConflict = item.slotTimes.some(itemSlot =>
            exitCourseClasses.some(exitClass =>
                exitClass.slotTimes.some(exitSlot =>
                    isSlotTimeConflict(itemSlot, exitSlot)
                )
            )
        );
        return { ...item, isConflict };
    });
}

/**
 * Gộp các lớp lý thuyết và lab, đồng thời đánh dấu lớp trùng lịch.
 */
export function groupCourseClassesWithLodash(
    items: CourseClassRegister[],
    exitCourseClasses: CourseClassRegister[] = []
) {
    // Đánh dấu trùng lịch
    const itemsWithFlag = markConflictCourseClasses(items, exitCourseClasses);

    // Tách các lớp lý thuyết và lab
    const lectures = itemsWithFlag.filter(c => c.courseClassType === 0);
    const labs = itemsWithFlag.filter(c => c.courseClassType === 1);

    // Nhóm các lab theo parentCourseClassCode
    const labsGrouped = _.groupBy(labs, "parentCourseClassCode");

    // Gắn các lab vào các lớp lý thuyết tương ứng
    return lectures.map(lecture => ({
        ...lecture,
        children: labsGrouped[lecture.courseClassCode] || [],
    }));
}

export function group2StageCourseClasses(items: CourseClassRegister[]) {
    const stage4 = items.filter(c => c.stage === 4);

    const others = items.filter(c => c.stage === 2 || c.stage === 3);

    const grouped = stage4.map(parent => ({
        ...parent,
        children: others.filter(child => child.parentCourseClassCode === parent.courseClassCode)
    }));

    return grouped;
}