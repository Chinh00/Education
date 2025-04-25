import { AxiosResponse } from "axios";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import { Education } from "@/domain/education.ts";
import http from "@/infrastructure/http.ts";
import {RegisterState} from "@/domain/register_state.ts";

export type CreateRegisterStateModel = {
    wishRegisterName: string;
    wishRegisterCode: string;
    semesterCode: string;
    startDate: Date;
    endDate: Date;
}
const getEducations = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>> => await http.get(`/trainingservice/api/Education?${GetQuery(query)}`)
const getRegisterStates = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<RegisterState>>>> => await http.get(`/trainingservice/api/Register?${GetQuery(query)}`)
const createRegisterState = async (model: CreateRegisterStateModel): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => await http.post(`/trainingservice/api/Register/create-wish-register`, model)
export {
    getEducations,
    getRegisterStates,
    createRegisterState
}