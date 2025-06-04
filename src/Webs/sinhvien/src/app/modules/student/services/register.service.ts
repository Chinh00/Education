import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {RegisterCourseClass, RegisterState} from "@/domain/register_state.ts";
import http from "@/infrastructure/http.ts";
import {RegisterSubject} from "@/domain/register_subject.ts";
import {CourseClass, CourseClassRegister} from "@/domain/course_class.ts";
export interface EducationSubjectModel {
    educationCode: string;
    subjectCodes: string[];
}
const getRegisterStateCurrent = async (): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => await http.get("/registerservice/api/Register/current")
const getRegisterSubjectsCurrent = async (educationCode: string): Promise<AxiosResponse<SuccessResponse<RegisterSubject>>> => await http.get(`/registerservice/api/Register/${educationCode}`)
const getRegisterCourseClass = async (): Promise<AxiosResponse<SuccessResponse<RegisterCourseClass>>> => await http.get(`/registerservice/api/Register/CourseClass`)
const getRegisterCourseClassBySubjectCode = async (subjectCode: string): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClassRegister>>>> => await http.get(`/registerservice/api/Register/CourseClass/${subjectCode}`)
const createRegisterWish = async (model: EducationSubjectModel): Promise<AxiosResponse<SuccessResponse<string>>> =>  await http.post("/registerservice/api/Register", model)

export {getRegisterStateCurrent, createRegisterWish, getRegisterSubjectsCurrent, getRegisterCourseClass, getRegisterCourseClassBySubjectCode}