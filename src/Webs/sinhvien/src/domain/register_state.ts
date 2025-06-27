export interface RegisterState {
    registerCode: string;
    semesterCode: string;
    semesterName: string;
    startDate: string;
    endDate: string; 
    minCredit: number;
    maxCredit: number;
}
export interface RegisterCourseClassState {
    semesterCode: string,
    studentRegisterStart: string,
    studentRegisterEnd: string
}