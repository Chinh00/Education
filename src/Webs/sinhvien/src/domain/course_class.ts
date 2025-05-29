
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
