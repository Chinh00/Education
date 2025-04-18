import { AxiosResponse } from "axios"
import { ClassManager } from "@/domain/class_manager.ts"
import http from "../../../../infrastructure/http"
import {GetQuery, Query} from "@/infrastructure/query.ts"
import {ListSuccessResponse, SuccessResponse } from "@/infrastructure/utils/success_response.ts"

const getClassManagers = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<ClassManager>>>> => await http.get(`/trainingservice/api/ClassManager?${GetQuery(query)}`)

export {getClassManagers}