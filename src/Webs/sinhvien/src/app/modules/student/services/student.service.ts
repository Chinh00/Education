import { Student } from "@/domain/student.model";
import http from "@/infrastructure/http";
import { SuccessResponse } from "@/infrastructure/utils/success_response";
import {AxiosResponse} from "axios";

const getStudentInformation = async (): Promise<AxiosResponse<SuccessResponse<Student>>> => {
    return await http.get<SuccessResponse<Student>>("/studentservice/api/Student")
}



export default getStudentInformation