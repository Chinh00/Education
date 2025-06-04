import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import http from "@/infrastructure/http.ts";
import {Department} from "@/domain/department.ts";
import { Education } from "@/domain/education";
import {Speciality} from "@/domain/speciality.ts";
import {Subject} from "@/domain/subject.ts";
import {Semester} from "@/domain/semester.ts";

const getDepartments = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Department>>>> => await http.get(`/trainingservice/api/Department?${GetQuery(query)}`)

const getEducations = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>> => await http.get(`/trainingservice/api/Education?${GetQuery(query)}`)
const getSpecialities = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Speciality>>>> => await http.get(`/trainingservice/api/Department/Speciality?${GetQuery(query)}`)
const getSubjects = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Subject>>>> => await http.get(`/trainingservice/api/Subject?${GetQuery(query)}`)
const getSemesters = (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Semester>>>> => http.get(`/trainingservice/api/Semester?${GetQuery(query)}`)
export {getDepartments, getEducations, getSpecialities, getSubjects, getSemesters};