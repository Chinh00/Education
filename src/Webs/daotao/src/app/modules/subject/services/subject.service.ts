import {GetQuery, Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Subject} from "@/domain/subject.ts";
import http from "@/infrastructure/http.ts";



const getSubjects = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Subject>>>> => await http.get(`/trainingservice/api/Subject?${GetQuery(query)}`)


export {getSubjects}