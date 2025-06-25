import {GetQuery, Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Education} from "@/domain/education.ts";
import http from "@/infrastructure/http.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {SubjectScheduleConfig} from "@/domain/subject_schedule_config.ts";
import {Room} from "@/domain/room.ts";
import {StudentSemester} from "@/domain/student_semester.ts";




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
    weekEnd: number,
    sessionLengths: number[]
}

export interface UpdateCourseClassStatusModel {
    courseClassCode: string,
    status: number
}

export interface RemoveStudentFromCourseClassModel {
    courseClassCode: string,
    studentCode: string
}
export interface SearchRoomFreeQueryModel {
    keySearch?: string,
    semesterCode?: string,
    stage?: number,
    dayOfWeek?: number,
    startPeriod?: number,
    sessionLength?: number,
    conditions?: string[]
}

export function GetQuerySearchRoomFreeQueryModel(query: SearchRoomFreeQueryModel): string {
    const params = new URLSearchParams();
    if (query?.keySearch) params.append("keySearch", query?.keySearch);
    if (query?.semesterCode) params.append("semesterCode", query?.semesterCode);
    if (query?.sessionLength) params.append("sessionLength", `${query?.sessionLength}`);
    if (query?.dayOfWeek) params.append("dayOfWeek", `${query?.dayOfWeek}`);
    if (query?.startPeriod) params.append("startPeriod", `${query?.startPeriod}`);
    if (query?.stage) params.append("stage", `${query?.stage}`);
    if (query?.conditions && Array.isArray(query.conditions)) {
        query.conditions.forEach(condition => params.append("conditions", condition));
    }
    return params.toString();
}
export interface AddCourseClassSlotTimelineModel {
    courseClassCode: string;
    roomCode: string;
    dayOfWeek: number;
    slots: string[];
}

export interface GetCanBeCourseClasReplaceModel {
    semesterCode?: string;
    stage?: number;
    subjectCode?: string;
    currentCourseClassCode: string;
    courseClassCodes?: string[];
}
export interface CourseClassStudentChangeRequest {
    semesterCode: string;
    studentCode: string;
    originalCourseClassCode: string;
    targetCourseClassCode: string;
}


export function GetQueryCanBeCourseClasReplaceModel(query: GetCanBeCourseClasReplaceModel): string {
    const params = new URLSearchParams();
    if (query?.semesterCode) params.append("semesterCode", query?.semesterCode);
    if (query?.stage === 0 || query?.stage === 1 || query?.stage === 2 || query?.stage === 3) params.append("stage", `${query?.stage}`);
    if (query?.subjectCode) params.append("subjectCode", query?.subjectCode);
    if (query?.currentCourseClassCode) params.append("currentCourseClassCode", query?.currentCourseClassCode);
    if (query?.courseClassCodes && Array.isArray(query.courseClassCodes)) {
        query.courseClassCodes.forEach(code => params.append("courseClassCodes", code));
    }
    
    return params.toString();
}
const getStudentSemesters =  async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<StudentSemester>>>> => await http.get(`/studentservice/api/Student/Semester?${GetQuery(query)}`)


const getCourseClasses = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.get(`/trainingservice/api/CourseClass?${GetQuery(query)}`)
const getRoomFreeSlots = async (query: SearchRoomFreeQueryModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<Room>>>> => await http.get(`/trainingservice/api/Building/Room/Free?${GetQuerySearchRoomFreeQueryModel(query)}`)
const createCourseClasses = async (model: CourseClassModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.post(`/trainingservice/api/CourseClass`, model)
const getCourseClassTimeline = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.get(`/trainingservice/api/CourseClass/Schedule?${GetQuery(query)}`)
const updateCourseClassStatus = async (model: UpdateCourseClassStatusModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.put(`/trainingservice/api/CourseClass/Status`, model)
const changeCourseClassStudent = async (model: CourseClassStudentChangeRequest): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.patch(`/trainingservice/api/CourseClass/Student/Change`, model)
const removeStudentFromCourseClass = async (model: RemoveStudentFromCourseClassModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.put(`/trainingservice/api/CourseClass/Student`, model)
const removeCourseClassSlotTimeline = async ({courseClassCode, slotTimelineId}: {courseClassCode: string, slotTimelineId: string}): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.delete(`/trainingservice/api/CourseClass/${courseClassCode}/Schedule/${slotTimelineId}`)
const addCourseClassSlotTimeline = async (model: AddCourseClassSlotTimelineModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.post(`/trainingservice/api/CourseClass/Schedule`, model)
const getCourseClassCanBeReplace = async (model: GetCanBeCourseClasReplaceModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<CourseClass>>>> => await http.get(`/trainingservice/api/CourseClass/CanBeReplace?${GetQueryCanBeCourseClasReplaceModel(model)}`)
export interface SubjectScheduleConfigModel {
    subjectCode: string;
    stage: number; 
    theoryTotalPeriod: number;
    practiceTotalPeriod: number;
    theorySessions: number[];
    practiceSessions: number[];
    weekLectureStart: number;
    weekLectureEnd: number;
    weekLabStart: number;
    weekLabEnd: number;
    sessionPriority: number;
    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
}

export interface SubjectScheduleConfigBothModel {
    subjectCode: string;
    stage: number; 
    // tong so tiet hoc tung gd
    totalPeriodOfStage1: number;
    totalPeriodOfStage2: number;
   
    // so tiet ly thuyet va thuc hanh gd1
    theoryTotalPeriodOfStage1: number;
    practiceTotalPeriodOfStage1: number;
    
    // so tiet ly thuyet va thuc hanh gd2
    theoryTotalPeriodOfStage2: number;
    practiceTotalPeriodOfStage2: number;
    // buoi hoc ly thuyet va thuc hanh gd1
    theorySessionsOfStage1: number[];
    practiceSessionsOfStage1: number[];
    // buoi hoc ly thuyet va thuc hanh gd2
    theorySessionsOfStage2: number[];
    practiceSessionsOfStage2: number[];




    theoryWeekStartStage1: number;
    theoryWeekEndStage1: number;
    practiceWeekStartStage1: number;
    practiceWeekEndStage1: number;
    
    theoryWeekStartStage2: number;
    theoryWeekEndStage2: number;
    practiceWeekStartStage2: number;
    practiceWeekEndStage2: number;
    
    
    
    
    sessionPriorityOfStage1: number;
    sessionPriorityOfStage2: number;
    lectureRequiredConditions: string[];
    labRequiredConditions: string[];
}
export interface GenerateScheduleModel {
    semesterCode: string;
    subjectCode: string;
    stage: number,
    courseClassCodes: string[];
}


export interface GenerateCourseClassesModel {
    semesterCode: string,
    subjectCode: string,
    stage: number,
    totalTheoryCourseClass: number,
    numberStudentsExpected: number
}

export interface CreateSubjectScheduleConfigModel {
    semesterCode: string;
    model: SubjectScheduleConfigModel;
}
export interface UpdateCourseClassModel {
    courseClassCode: string;
    courseClassName: string;
    numberStudentsExpected: number;
    weekStart: number;
}
export interface GetSlotTimelineFreeQueryModel {
    semesterCode: string;
    stage?: number;
    sessionLength?: number;
    conditions?: string[];
}
export function GetSlotTimelineFreeQuery(query: GetSlotTimelineFreeQueryModel): string {
    const params = new URLSearchParams();
    if (query?.semesterCode) params.append("semesterCode", query?.semesterCode);
    if (query?.stage === 0 || query?.stage === 1 || query?.stage === 2 || query?.stage === 3) params.append("stage", `${query?.stage}`);
    if (query?.sessionLength) params.append("sessionLength", `${query?.sessionLength}`);
    if (query?.conditions && Array.isArray(query.conditions)) {
        query.conditions.forEach(condition => params.append("conditions", condition));
    }
    
    return params.toString();
}


const generateCourseClasses = async (model: GenerateCourseClassesModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.post(`/trainingservice/api/CourseClass/GenerateCourseClasses`, model)
const generateSchedule = async (model: GenerateScheduleModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.post(`/trainingservice/api/CourseClass/GenerateSchedule`, model)
const createSubjectScheduleConfig = async (model: CreateSubjectScheduleConfigModel): Promise<AxiosResponse<SuccessResponse<SubjectScheduleConfigModel>>> => await http.post(`/trainingservice/api/CourseClass/SubjectScheduleConfig`, model)
const getSubjectScheduleConfig = async (query: Query): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SubjectScheduleConfig>>>> => await http.get(`/trainingservice/api/CourseClass/SubjectScheduleConfig?${GetQuery(query)}`)
const updateCourseClass = async (model: UpdateCourseClassModel): Promise<AxiosResponse<SuccessResponse<string>>> => await http.put(`/trainingservice/api/CourseClass`, model)
const removeCourseClass = async (courseClassCode: string): Promise<AxiosResponse<SuccessResponse<string>>> => await http.delete(`/trainingservice/api/CourseClass/${courseClassCode}`)
const getSlotTimelineFree = async (query: GetSlotTimelineFreeQueryModel): Promise<AxiosResponse<SuccessResponse<ListSuccessResponse<SlotTimeline>>>> => await http.get(`/trainingservice/api/CourseClass/SlotTimeline/Free?${GetSlotTimelineFreeQuery(query)}`)

export {getCourseClasses, changeCourseClassStudent, getStudentSemesters, getCourseClassCanBeReplace, getSlotTimelineFree, removeCourseClassSlotTimeline, addCourseClassSlotTimeline, getRoomFreeSlots, generateSchedule, updateCourseClass, removeCourseClass, getSubjectScheduleConfig, createSubjectScheduleConfig, getCourseClassTimeline, createCourseClasses, updateCourseClassStatus, removeStudentFromCourseClass, generateCourseClasses}