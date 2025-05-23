import {AxiosResponse} from "axios";
import {SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {RegisterState} from "@/domain/register_state.ts";
import http from "@/infrastructure/http.ts";
import {RegisterSubject} from "@/domain/register_subject.ts";
export interface EducationSubjectModel {
    educationCode: string;
    subjectCodes: string[];
}
const getRegisterStateCurrent = async (): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => await http.get("/registerservice/api/Register/current")
const getRegisterSubjectsCurrent = async (educationCode: string): Promise<AxiosResponse<SuccessResponse<RegisterSubject>>> => await http.get(`/registerservice/api/Register/${educationCode}`)
const createRegisterWish = async (model: EducationSubjectModel): Promise<AxiosResponse<SuccessResponse<string>>> =>  await http.post("/registerservice/api/Register", model)
export {getRegisterStateCurrent, createRegisterWish, getRegisterSubjectsCurrent}