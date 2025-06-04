import http from "@/infrastructure/http.ts";
import {GetQuery} from "@/infrastructure/query.ts";

export interface UpdateCourseClassTeacher {
    courseClassCode: string,
    teacherCode: string
}
const updateCourseClassTeacher = async (model: UpdateCourseClassTeacher) => await http.put(`/trainingservice/api/CourseClass`, model)

export {
    updateCourseClassTeacher
}