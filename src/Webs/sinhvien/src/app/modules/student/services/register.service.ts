import {AxiosResponse} from "axios";
import {SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {RegisterState} from "@/domain/register_state.ts";
import http from "@/infrastructure/http.ts";
export interface EducationSubjectModel {
    educationCode: string;
    subjectCodes: string[];
}
const getRegisterStateCurrent = async (): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => {
    return await http.get<SuccessResponse<RegisterState>>("/registerservice/api/Register/current")
}
const createRegisterWish = async (model: EducationSubjectModel): Promise<AxiosResponse<SuccessResponse<string>>> => {
    return await http.post<SuccessResponse<string>>("/registerservice/api/Register", model)
}
export {getRegisterStateCurrent, createRegisterWish}