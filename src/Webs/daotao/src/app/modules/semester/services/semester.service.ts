import { AxiosResponse } from "axios";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Semester} from "@/domain/semester.ts";
import http from "@/infrastructure/http.ts";


export interface CreateSemesterModel {
    semesterName: string;
    semesterCode: string;
    startDate: string; 
    endDate: string;  
}

const getSemesters = (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Semester>>>> => http.get(`/trainingservice/api/Semester?${GetQuery(query)}`) 
const createSemester = (model: CreateSemesterModel): Promise<AxiosResponse<SuccessResponse<Semester>>> => http.post(`/trainingservice/api/Semester`, model)
export {getSemesters, createSemester}