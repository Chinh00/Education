import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {removeCourseClass} from "@/app/modules/education/services/courseClass.service.ts";

const useRemoveCourseClass = () => {
    return useMutation({
        mutationKey: ["useRemoveCourseClass"],
        mutationFn: removeCourseClass,

    })
}
export {useRemoveCourseClass}