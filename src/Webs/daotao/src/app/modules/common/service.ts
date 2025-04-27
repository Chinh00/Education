import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Course} from "@/domain/course.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import http from "@/infrastructure/http.ts";
import {Department} from "@/domain/department.ts";
import {Speciality} from "@/domain/speciality.ts";

const getCourses= async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Course>>>> => await http.get(`/trainingservice/api/Course?${GetQuery(query)}`)
const getDepartments = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Department>>>> => await http.get(`/trainingservice/api/Department?${GetQuery(query)}`)
const getSpecialities = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Speciality>>>> => await http.get(`/trainingservice/api/Department/Speciality?${GetQuery(query)}`)


export {getCourses, getDepartments, getSpecialities};