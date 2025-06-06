import { useMutation } from "@tanstack/react-query"
import {
    removeStudentFromCourseClass,
    updateCourseClassStatus
} from "@/app/modules/education/services/courseClass.service.ts";

const useUpdateCourseClassStatus = () => {
    return useMutation({
        mutationKey: ["useUpdateCourseClassStatus"],
        mutationFn: updateCourseClassStatus,

    })
}
export {useUpdateCourseClassStatus}