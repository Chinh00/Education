import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Course} from "@/domain/course.ts";
import {GetQuery, Query} from "@/infrastructure/query.ts";
import http from "@/infrastructure/http.ts";
import {Department} from "@/domain/department.ts";
import {Speciality} from "@/domain/speciality.ts";
import {Subject} from "@/domain/subject.ts";
import {Building} from "@/domain/building.ts";
import {Room} from "@/domain/room.ts";
import {EventHistory} from "@/domain/event_history.ts";
import {Condition} from "@/domain/condition.ts";

const getCourses= async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Course>>>> => await http.get(`/trainingservice/api/Course?${GetQuery(query)}`)
const getDepartments = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Department>>>> => await http.get(`/trainingservice/api/Department?${GetQuery(query)}`)
const getSpecialities = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Speciality>>>> => await http.get(`/trainingservice/api/Department/Speciality?${GetQuery(query)}`)
const getSubjects = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Subject>>>> => await http.get(`/trainingservice/api/Subject?${GetQuery(query)}`)
const getBuildings = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Building>>>> => await http.get(`/trainingservice/api/Building?${GetQuery(query)}`)
const getRooms = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Room>>>> => await http.get(`/trainingservice/api/Building/Room?${GetQuery(query)}`)
const getEventsStore = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<EventHistory>>>> => await http.get(`/trainingservice/api/EventStore?${GetQuery(query)}`)
const getConditions = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Condition>>>> => await http.get(`/trainingservice/api/CourseClass/Condition?${GetQuery(query)}`)



export {getCourses, getDepartments, getSpecialities, getSubjects, getBuildings, getRooms, getEventsStore, getConditions};