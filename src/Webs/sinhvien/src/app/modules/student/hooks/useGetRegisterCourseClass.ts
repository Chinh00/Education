import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClasses} from "@/app/modules/student/services/student.service.ts";
import { getRegisterCourseClass, getRegisterCourseClassBySubjectCode } from "../services/register.service";

const useGetRegisterCourseClass = (enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetRegisterCourseClass"],
        queryFn: () => getRegisterCourseClass(),
        enabled: enable,
    })
}

const useGetRegisterCourseClassBySubjectCode = (subjectCode: string, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetRegisterCourseClassBySubjectCode", subjectCode],
        queryFn: () => getRegisterCourseClassBySubjectCode(subjectCode),
        enabled: enable,
    })
}


export {useGetRegisterCourseClass, useGetRegisterCourseClassBySubjectCode};