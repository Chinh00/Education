import {GetQuery, Query} from "@/infrastructure/query.ts";
import http from "@/infrastructure/http.ts";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Student} from "@/domain/student.ts";
import {AxiosResponse} from "axios";

const getStudents = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Student>>>> => await http.get(`/studentservice/api/Student/all?${GetQuery(query)}`);
export {getStudents};