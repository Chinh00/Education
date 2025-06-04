export interface RegisterState {
    registerCode: string;
    semesterCode: string;
    semesterName: string;
    staDate: string;
    endDate: string; 
    minCredit: number;
    maxCredit: number;
}
export interface RegisterCourseClass {
    semesterCode: string,
    studentRegisterStart: string,
    studentRegisterEnd: string
}