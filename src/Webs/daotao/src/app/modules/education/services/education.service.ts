import { AxiosResponse } from "axios";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import { Education } from "@/domain/education.ts";
import http from "@/infrastructure/http.ts";
import {Register} from "@/domain/register_state.ts";
import {SubjectRegister} from "@/domain/student_register.ts";
import {Subject} from "@/domain/subject.ts";

export type CreateRegisterStateModel = {
    semesterCode: string;
    wishStartDate: string;
    wishEndDate: string;
    minCredit: number;
    maxCredit: number;
}




const getEducations = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>> => await http.get(`/trainingservice/api/Education?${GetQuery(query)}`)
const getRegisters = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Register>>>> => await http.get(`/trainingservice/api/Register?${GetQuery(query)}`)
const createRegisterState = async (model: CreateRegisterStateModel): Promise<AxiosResponse<SuccessResponse<Register>>> => await http.post(`/trainingservice/api/Register`, model)
const getSubjectRegister = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SubjectRegister>>>> => await http.get(`/trainingservice/api/Register/subject-register?${GetQuery(query)}`);
export {
    getEducations,
    getRegisters,
    createRegisterState,
    getSubjectRegister,
}