import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {removeStudentFromCourseClass} from "@/app/modules/education/services/courseClass.service.ts";

const useRemoveStudentFromCourseClass = () => {
    return useMutation({
        mutationKey: ["removeStudentFromCourseClass"],
        mutationFn: removeStudentFromCourseClass,

    })
}
export {useRemoveStudentFromCourseClass}