import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import http from "@/infrastructure/http.ts";
import { Education } from "@/domain/education";
import {Speciality} from "@/domain/speciality.ts";
import {Subject} from "@/domain/subject.ts";
import {Semester} from "@/domain/semester.ts";
import {Notification} from "@/domain/notification.ts";


const getEducations = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>> => await http.get(`/trainingservice/api/Education?${GetQuery(query)}`)
const getSubjects = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Subject>>>> => await http.get(`/trainingservice/api/Subject?${GetQuery(query)}`)
const getSemesters = (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Semester>>>> => http.get(`/trainingservice/api/Semester?${GetQuery(query)}`)
const getNotifications = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Notification>>>> => await http.get(`/notificationservice/api/Notification?${GetQuery(query)}`)

export {getEducations, getSubjects, getSemesters, getNotifications};