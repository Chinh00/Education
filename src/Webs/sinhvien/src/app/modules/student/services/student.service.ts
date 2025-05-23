import { Student } from "@/domain/student.ts";
import http from "@/infrastructure/http";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response";
import {AxiosResponse} from "axios";
import {StudentSemester} from "@/domain/student_semester.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";

const getStudentInformation = async (): Promise<AxiosResponse<SuccessResponse<Student>>> => await http.get("/studentservice/api/Student")
const syncDataFromDataProvider = async (): Promise<AxiosResponse<SuccessResponse<boolean>>> => await http.post("/studentservice/api/Student/Sync")

const getStudentSemesters =  async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<StudentSemester>>>> => await http.get(`/studentservice/api/Student/Semester?${GetQuery(query)}`)

export  {
    getStudentInformation,
    syncDataFromDataProvider,
    getStudentSemesters
}