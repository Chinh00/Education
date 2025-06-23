import http from "@/infrastructure/http.ts";
import {GetQuery} from "@/infrastructure/query.ts";
import {GetSlotTimelineFreeQueryModel} from "@/app/modules/education/services/courseClass.service.ts";

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

export interface TeacherFreeSlotTimeline {
    semesterCode?: string;
    stage?: number;
    subjectCode?: string;
    courseClassCode?: string;
}

export function GetTeacherFreeSlotTimeline(query: TeacherFreeSlotTimeline): string {
    const params = new URLSearchParams();
    if (query?.semesterCode) params.append("semesterCode", query?.semesterCode);
    if (query?.stage === 0 || query?.stage === 1 || query?.stage === 2 || query?.stage === 3) params.append("stage", `${query?.stage}`);
    if (query?.subjectCode) params.append("subjectCode", `${query?.subjectCode}`);
    if (query?.courseClassCode) params.append("courseClassCode", `${query?.courseClassCode}`);
    

    return params.toString();
}



const updateCourseClassTeacher = async (model: UpdateCourseClassTeacher) => await http.put(`/trainingservice/api/CourseClass/Teacher`, model)
const generateTeacherForCourseClass = async (model: CourseClassAssignment) => await http.post(`/trainingservice/api/CourseClass/Teacher/GenerateTeacher`, model)
const getTeacherFreeSlotTimeline = async (query: TeacherFreeSlotTimeline) => await http.get(`/trainingservice/api/CourseClass/Teacher/Free?${GetTeacherFreeSlotTimeline(query)}`)

export {
    generateTeacherForCourseClass,
    updateCourseClassTeacher,
    getTeacherFreeSlotTimeline
}