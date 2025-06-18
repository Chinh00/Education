import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {
    removeCourseClassSlotTimeline,
    updateCourseClass
} from "@/app/modules/education/services/courseClass.service.ts";

const useRemoveCourseClassSlotTimeline = () => {
    return useMutation({
        mutationKey: ["useRemoveCourseClassSlotTimeline"],
        mutationFn: removeCourseClassSlotTimeline,

    })
}
export {useRemoveCourseClassSlotTimeline}