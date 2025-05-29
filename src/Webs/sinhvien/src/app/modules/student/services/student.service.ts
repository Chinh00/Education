import { Student } from "@/domain/student.ts";
import http from "@/infrastructure/http";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response";
import {AxiosResponse} from "axios";
import {StudentSemester} from "@/domain/student_semester.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {CourseClass} from "@/domain/course_class.ts";

const getStudentInformation = async (): Promise<AxiosResponse<SuccessResponse<Student>>> => await http.get("/studentservice/api/Student")
const syncDataFromDataProvider = async (): Promise<AxiosResponse<SuccessResponse<boolean>>> => await http.post("/studentservice/api/Student/Sync")

const getStudentSemesters =  async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<StudentSemester>>>> => await http.get(`/studentservice/api/Student/Semester?${GetQuery(query)}`)
const getCourseClassTimeline = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.get(`/trainingservice/api/CourseClass/Schedule?${GetQuery(query)}`)
const getCourseClasses = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.get(`/trainingservice/api/CourseClass?${GetQuery(query)}`)

export  {
    getStudentInformation,
    syncDataFromDataProvider,
    getStudentSemesters,
    getCourseClassTimeline,
    getCourseClasses
}