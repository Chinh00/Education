import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {createCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";

const useCreateCourseClass = () => {
    return useMutation({
        mutationKey: ["useCreateCourseClass"],
        mutationFn: createCourseClasses,

    })
}
export {useCreateCourseClass}