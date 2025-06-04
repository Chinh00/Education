import {GetQuery, Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Subject} from "@/domain/subject.ts";
import http from "@/infrastructure/http.ts";


export interface SubjectUpdateModel {
    subjectCode: string;

    lectureTotal: number;
    lectureLesson: number;
    lecturePeriod: number;

    labTotal: number;
    labLesson: number;
    labPeriod: number;

    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
}


const getSubjects = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Subject>>>> => await http.get(`/trainingservice/api/Subject?${GetQuery(query)}`)
const updateSubjects = async (model: SubjectUpdateModel): Promise<AxiosResponse<SuccessResponse<string>>> => await http.put(`/trainingservice/api/Subject`, model)


export {getSubjects, updateSubjects}