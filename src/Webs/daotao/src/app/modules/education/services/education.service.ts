import { AxiosResponse } from "axios";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import { Education } from "@/domain/education.ts";
import http from "@/infrastructure/http.ts";
import {RegisterState} from "@/domain/register_state.ts";
import {StudentRegister} from "@/domain/student_register.ts";
import {Subject} from "@/domain/subject.ts";
import {SubjectTimelineConfig} from "@/domain/subject_timeline_config.ts";

export type CreateRegisterStateModel = {
    semesterCode: string;
    semesterName: string;
    startDate: string;
    endDate: string;
    minCredit: number;
    maxCredit: number;
}
export interface SubjectTimelineConfigModel {
    subjectCode: string;
    periodTotal: number;
    lectureTotal: number;
    lectureLesson: number;
    lecturePeriod: number;
    labTotal: number;
    labLesson: number;
    labPeriod: number;
    minDaySpaceLecture: number;
    minDaySpaceLab: number;
    lectureMinStudent: number;
    labMinStudent: number;
}


const getEducations = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>> => await http.get(`/trainingservice/api/Education?${GetQuery(query)}`)
const getRegisterStates = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<RegisterState>>>> => await http.get(`/trainingservice/api/Register?${GetQuery(query)}`)
const createRegisterState = async (model: CreateRegisterStateModel): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => await http.post(`/trainingservice/api/Register/create-wish-register`, model)
const getStudentRegister = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<StudentRegister>>>> => await http.get(`/trainingservice/api/Register/student-register?${GetQuery(query)}`);
const getSubjectTimelineConfig = async (subjectCode: string): Promise<AxiosResponse<SuccessResponse<SubjectTimelineConfig>>> => await http.get(`/trainingservice/api/Subject/${subjectCode}/timeline-config`);
const updateSubjectTimelineConfig = async (model: SubjectTimelineConfigModel): Promise<AxiosResponse<SuccessResponse<SubjectTimelineConfig>>> => await http.put(`/trainingservice/api/Subject/timeline-config`, model);
export {
    getEducations,
    getRegisterStates,
    createRegisterState,
    getStudentRegister,
    getSubjectTimelineConfig,
    updateSubjectTimelineConfig
}