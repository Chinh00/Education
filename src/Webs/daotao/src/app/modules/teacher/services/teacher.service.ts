import http from "@/infrastructure/http.ts";
import {GetQuery} from "@/infrastructure/query.ts";

export interface UpdateCourseClassTeacher {
    courseClassCode: string,
    teacherCode: string
}
export interface CourseClassAssignment {
    semesterCode: string;
    stage: number;
    subjectCode: string;
    courseClassCodes: string[];
}

const updateCourseClassTeacher = async (model: UpdateCourseClassTeacher) => await http.put(`/trainingservice/api/CourseClass`, model)
const generateTeacherForCourseClass = async (model: CourseClassAssignment) => await http.post(`/trainingservice/api/CourseClass/Teacher/GenerateTeacher`, model)

export {
    generateTeacherForCourseClass,
    updateCourseClassTeacher,
}