import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClasses} from "@/app/modules/student/services/student.service.ts";
import { getStudentRegisterCourseClass } from "../services/register.service";

const useGetStudentRegisterCourseClass = () => {
    return useQuery({
        queryKey: ["useGetStudentRegisterCourseClass"],
        queryFn: () => getStudentRegisterCourseClass()
    })
}

export {useGetStudentRegisterCourseClass};