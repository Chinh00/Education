import http from "../../../cores/http.ts";
import {SuccessResponse} from "../../../infrastructure/utils/success_response.ts";
import {Student} from "../../../domain/student.model.ts";
import {AxiosResponse} from "axios";

const getStudentInformation = async (): Promise<AxiosResponse<SuccessResponse<Student>>> => {
    return await http.get<SuccessResponse<Student>>("/studentservice/api/Student")
}

export default getStudentInformation