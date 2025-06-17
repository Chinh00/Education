import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {updateCourseClass} from "@/app/modules/education/services/courseClass.service.ts";

const useUpdateCourseClass = () => {
    return useMutation({
        mutationKey: ["useUpdateCourseClass"],
        mutationFn: updateCourseClass,

    })
}
export {useUpdateCourseClass}