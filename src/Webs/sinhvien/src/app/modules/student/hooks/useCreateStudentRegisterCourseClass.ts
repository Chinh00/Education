import {useMutation} from "@tanstack/react-query";
import { createRegisterWish, createStudentRegisterCourseClass } from "../services/register.service";

const useCreateStudentRegisterCourseClass = () => {
    return useMutation({
        mutationKey: ["useCreateStudentRegisterCourseClass"],
        mutationFn: createStudentRegisterCourseClass
    })
}
export {useCreateStudentRegisterCourseClass}