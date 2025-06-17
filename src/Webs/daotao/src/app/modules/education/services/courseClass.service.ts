import {GetQuery, Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Education} from "@/domain/education.ts";
import http from "@/infrastructure/http.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";




export interface SlotTimelineModel {
    roomCode: string;
    dayOfWeek: number;
    slot: string[];
}

export interface CourseClassModel {
    courseClassCode: string;
    courseClassName: string;
    courseClassType: number;
    subjectCode: string;
    semesterCode: string;
    numberStudentsExpected: number,
    parentCourseClassCode: string,
    stage: number,
    weekStart: number,
    slotTimelines: SlotTimelineModel[];
}

export interface UpdateCourseClassStatusModel {
    courseClassCode: string,
    status: number
}

export interface RemoveStudentFromCourseClassModel {
    courseClassCode: string,
    studentCode: string
}


const getCourseClasses = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.get(`/trainingservice/api/CourseClass?${GetQuery(query)}`)
const createCourseClasses = async (model: CourseClassModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.post(`/trainingservice/api/CourseClass`, model)
const getCourseClassTimeline = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.get(`/trainingservice/api/CourseClass/Schedule?${GetQuery(query)}`)
const updateCourseClassStatus = async (model: UpdateCourseClassStatusModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.put(`/trainingservice/api/CourseClass/Status`, model)
const removeStudentFromCourseClass = async (model: RemoveStudentFromCourseClassModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.put(`/trainingservice/api/CourseClass/Student`, model)
export interface SubjectScheduleConfigModel {
    subjectCode: string;
    totalTheoryCourseClass: number;
    stage: number; // có thể thay bằng enum nếu bạn định nghĩa
    theoryTotalPeriod: number;
    practiceTotalPeriod: number;
    theorySessions: number[];
    practiceSessions: number[];
    weekStart: number;
    sessionPriority: number;
    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
}

export interface SubjectScheduleConfigBothModel {
    subjectCode: string;
    totalTheoryCourseClass: number;
    stage: number; 
    totalPeriodOfStage1: number;
    totalPeriodOfStage2: number;
    theoryTotalPeriod: number;
    practiceTotalPeriod: number;
    theoryTotalPeriodOfStage1: number;
    practiceTotalPeriodOfStage1: number;
    theoryTotalPeriodOfStage2: number;
    practiceTotalPeriodOfStage2: number;
    theorySessionsOfStage1: number[];
    practiceSessionsOfStage1: number[];
    weekStart: number;
    sessionPriorityOfStage1: number;
    sessionPriorityOfStage2: number;
    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
}




export interface CreateSubjectScheduleConfigModel {
    semesterCode: string;
    model: SubjectScheduleConfigModel;
}
const generateCourseClasses = async (): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.post(`/trainingservice/api/CourseClass/GenerateCourseClasses`)
const createSubjectScheduleConfig = async (model: CreateSubjectScheduleConfigModel): Promise<AxiosResponse<SuccessResponse<SubjectScheduleConfigModel>>> => await http.post(`/trainingservice/api/CourseClass/SubjectScheduleConfig`, model)

export {getCourseClasses, createSubjectScheduleConfig, getCourseClassTimeline, createCourseClasses, updateCourseClassStatus, removeStudentFromCourseClass, generateCourseClasses}