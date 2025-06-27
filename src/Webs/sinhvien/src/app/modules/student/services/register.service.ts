import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {RegisterCourseClassState, RegisterState} from "@/domain/register_state.ts";
import http from "@/infrastructure/http.ts";
import {RegisterSubject} from "@/domain/register_subject.ts";
import { CourseClassRegister} from "@/domain/course_class.ts";
import {StudentRegister} from "@/domain/student_register.ts";
export interface EducationSubjectModel {
    educationCode: string;
    subjectCodes: string[];
}


// api lấy thông tin đợt đăng ký nguyện vọng
const getRegisterWish = async (): Promise<AxiosResponse<SuccessResponse<RegisterState>>> => await http.get("/registerservice/api/Register/RegisterWish")
// api lấy thông tin môn học đã đăng ký nguyện vọng theo mã đợt đăng ký
const getRegisterSubjectWish = async (educationCode: string): Promise<AxiosResponse<SuccessResponse<RegisterSubject>>> => await http.get(`/registerservice/api/Register/RegisterWish/${educationCode}`)
// api tạo nguyện vọng đăng ký môn học
const createRegisterWish = async (model: EducationSubjectModel): Promise<AxiosResponse<SuccessResponse<string>>> =>  await http.post("/registerservice/api/Register/RegisterWish", model)

// api lấy thông tin đăng ký lớp học phần
const getRegisterCourseClass = async (): Promise<AxiosResponse<SuccessResponse<RegisterCourseClassState>>> => await http.get(`/registerservice/api/Register/RegisterCourseClass/State`)
// api lấy thông tin danh sách lớp học phần theo mã môn học
const getRegisterCourseClassBySubjectCode = async (subjectCode: string): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClassRegister>>>> => await http.get(`/registerservice/api/Register/RegisterCourseClass/${subjectCode}`)

export interface StudentRegisterCourseClassModel {
    semesterCode: string,
    subjectCode: string,
    courseClassCode: string
}
const createStudentRegisterCourseClass = async (model: StudentRegisterCourseClassModel): Promise<AxiosResponse<SuccessResponse<string>>> => await http.post(`/registerservice/api/Register/RegisterCourseClass`, model) 
const getStudentRegisterCourseClass = async (): Promise<AxiosResponse<SuccessResponse<StudentRegister>>> => await http.get(`/registerservice/api/Register/RegisterCourseClass`) 

export {
    getRegisterWish, createRegisterWish, getRegisterSubjectWish, getRegisterCourseClass, getRegisterCourseClassBySubjectCode, createStudentRegisterCourseClass, getStudentRegisterCourseClass}