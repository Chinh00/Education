import { Student } from "@/domain/student.model";
import http from "@/infrastructure/http";
import { SuccessResponse } from "@/infrastructure/utils/success_response";
import {AxiosResponse} from "axios";

const getStudentInformation = async (): Promise<AxiosResponse<SuccessResponse<Student>>> => await http.get("/studentservice/api/Student")
const syncDataFromDataProvider = async (): Promise<AxiosResponse<SuccessResponse<boolean>>> => await http.post("/studentservice/api/Student/Sync")



export  {
    getStudentInformation,
    syncDataFromDataProvider
}